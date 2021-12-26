import { NextFunction, Request, Response } from "express";
import {
  compose,
  NI_Next,
  Done,
  chain,
  then,
  _catch,
  fold,
  map,
  tap,
  elif,
  Next,
  thenDoneFlat,
} from "fmagic";
import {
  FirestoreDate,
  FrontendRequestBody,
  Path,
  Width,
  Photo,
  PhotoInfo,
  WebImageInfo,
  TransformedImageInfo,
  AddPhotoData,
  EditPhotoData,
  WebImagesInfo,
  PhotoFieldsToUpdateOnAdd,
  PhotoMiddlewareDone,
  FsService,
  OriginalPhotoStoreService,
  PhotosDbService,
  PhotosWebStoreService,
  PhotoTransformationsService,
  ValidatorService,
  PhotoFieldsToUpdateOnEdit,
} from "../../types";
import {
  isValidPhotoDbRecordOnAdd,
  isValidPhotoDbRecordOnEdit,
} from "../service/Validator";
import { getPhoto, updatePhoto } from "../service/PhotosDb";
import { removePhoto, removePhotos } from "../service/Fs";
import { save, update, isExists } from "../service/OriginalPhotoStore";
//import { getPhotoInfo, makePaths, makeOptimizedByWidthPhotoFiles, makeBase64String } from "../service/PhotoTransformations";
import {
  getPhotoInfo,
  makePaths,
  makeBase64String,
  makeOptimizedByWidthPhotoFiles,
} from "../service/PhotoTransformations";
import {
  makeWebImagesInfo,
  uploadPhotos,
  removePhotos as removePhotosFromWebStore,
} from "../service/PhotosWebStore";
import {
  makePhotoFieldsToUpdateOnAdd,
  makeBeautyErrorMsg,
  makePhotoFieldsToUpdateOnEdit,
} from "./Photos.helper";
import { photoSizes } from "../../config";

export const checkFirestoreRecordOnAdd_ =
  (
    getPhoto: PhotosDbService["getPhoto"],
    isValidPhotoDbRecordOnAdd: ValidatorService["isValidPhotoDbRecordOnAdd"]
  ) =>
  (data: AddPhotoData) =>
    compose<unknown, Promise<NI_Next<AddPhotoData> | Done>>(
      () => getPhoto(data.reqInfo.photoId),
      then((photo: Photo<FirestoreDate>) =>
        isValidPhotoDbRecordOnAdd(
          data.reqInfo.photoId,
          photo,
          data.reqInfo.userUid
        )
      ),
      then((valid: boolean | string) =>
        typeof valid === "string"
          ? Done.of({ data, error: valid })
          : NI_Next.of(data)
      ),
      _catch((err: any) => Done.of({ data, error: err }))
    )();

export const checkFirestoreRecordOnAdd = checkFirestoreRecordOnAdd_(
  getPhoto,
  isValidPhotoDbRecordOnAdd
);

////////////////////////////////////////////////

export const checkFirestoreRecordOnEditAndCollectWebIds_ =
  (
    getPhoto: PhotosDbService["getPhoto"],
    isValidPhotoDbRecordOnEdit: ValidatorService["isValidPhotoDbRecordOnEdit"]
  ) =>
  (data: EditPhotoData) =>
    compose<unknown, Promise<NI_Next<EditPhotoData> | Done>>(
      () => getPhoto(data.reqInfo.photoId),

      then((photo: Photo<FirestoreDate>) => ({
        photo,
        valid: isValidPhotoDbRecordOnEdit(
          data.reqInfo.photoId,
          photo,
          data.reqInfo.userUid
        ),
      })),
      then(
        ({
          photo,
          valid,
        }: {
          photo: Photo<FirestoreDate>;
          valid: boolean | string;
        }) =>
          typeof valid === "string"
            ? Done.of({ data, error: valid })
            : NI_Next.of({
                ...data,
                prevWebImagesIds: photo.files,
                prevGoogleDriveId: photo.googleDriveId,
              })
      ),
      _catch((err: any) => Done.of({ data, error: err }))
    )();

export const checkFirestoreRecordOnEditAndCollectWebIds =
  checkFirestoreRecordOnEditAndCollectWebIds_(
    getPhoto,
    isValidPhotoDbRecordOnEdit
  );

///////////////////////////////////////////

export const makePhotoInfoAndPathsToOptimizedPhotos_ =
  (
    getPhotoInfo: PhotoTransformationsService["getPhotoInfo"],
    makePaths: PhotoTransformationsService["makePaths"]
  ) =>
  (data: AddPhotoData) =>
    compose<AddPhotoData, Promise<NI_Next<AddPhotoData> | Done>>(
      async () => ({
        ...data,
        photoInfo: await getPhotoInfo(data.reqInfo.photoFile.path),
        optimizedPhotosPaths: makePaths(data.reqInfo.photoFile.filename),
      }),
      //then(tap((data: any) => console.log("TAAAAAPP", data))),
      then(NI_Next.of),
      _catch((err: any) => {
        console.log("---------EEERRRRORORRR", err);
        return Done.of({ data, error: err });
      })
    )();

export const makePhotoInfoAndPathsToOptimizedPhotos =
  makePhotoInfoAndPathsToOptimizedPhotos_(getPhotoInfo, makePaths);

//////////////////////////////////////////////

export const makeOptimizedPhotosAndBase64String_ =
  (
    makeOptimizedByWidthPhotoFiles: PhotoTransformationsService["makeOptimizedByWidthPhotoFiles"],
    makeBase64String: PhotoTransformationsService["makeBase64String"],
    photoSizes: { width: number; height: number }[]
  ) =>
  (data: AddPhotoData) =>
    compose<AddPhotoData, Promise<NI_Next<AddPhotoData> | Done>>(
      //tap((data: any) => console.log("DATA ---- ", data)),
      () =>
        Promise.all([
          makeOptimizedByWidthPhotoFiles(
            data.optimizedPhotosPaths as Map<number, string>,
            {
              height: (data.photoInfo as PhotoInfo).height,
              width: (data.photoInfo as PhotoInfo).width,
            },
            (data.photoInfo as PhotoInfo).isInverted,
            photoSizes,
            data.reqInfo.photoFile.path
          ),
          makeBase64String(
            data.reqInfo.photoFile.path,
            (data.photoInfo as PhotoInfo).isInverted
          ),
        ]),
      then(
        ([optimizedImageInfo, base64String]: [
          TransformedImageInfo[],
          string
        ]) =>
          Next.of({
            ...data,
            optimizedImageInfo,
            base64String,
          })
      ),
      _catch((error: any) => Done.of({ data, error }))
    )();

export const makeOptimizedPhotosAndBase64String =
  makeOptimizedPhotosAndBase64String_(
    makeOptimizedByWidthPhotoFiles,
    makeBase64String,
    photoSizes
  );

////////////////////////////////////////////

export const uploadPhotosToPhotosWebStorage_ =
  (
    uploadPhotos: PhotosWebStoreService["uploadPhotos"],
    makeWebImagesInfo: PhotosWebStoreService["makeWebImagesInfo"]
  ) =>
  (data: AddPhotoData) =>
    compose<AddPhotoData, Promise<NI_Next<AddPhotoData> | Done>>(
      () =>
        uploadPhotos([
          ...(data.optimizedPhotosPaths as Map<Width, Path>).values(),
        ]),
      then((webImagesInfo: WebImageInfo[]) =>
        makeWebImagesInfo(
          webImagesInfo,
          data.optimizedPhotosPaths as Map<Width, Path>
        )
      ),
      then((webImagesInfo: WebImageInfo[]) =>
        NI_Next.of({
          ...data,
          webImagesInfo,
        })
      ),
      _catch((error: any) => Done.of({ data, error }))
    )();

export const uploadPhotosToPhotosWebStorage = uploadPhotosToPhotosWebStorage_(
  uploadPhotos,
  makeWebImagesInfo
);

//////////////////////////////////////

export const makePhotoDataAndSendToDbOnAdd_ =
  (updatePhoto: PhotosDbService["updatePhoto"]) => (data: AddPhotoData) =>
    compose<AddPhotoData, Promise<NI_Next<AddPhotoData> | Done>>(
      () => makePhotoFieldsToUpdateOnAdd(data),

      (fieldsToUpdate: PhotoFieldsToUpdateOnAdd) =>
        updatePhoto(data.reqInfo.photoId, fieldsToUpdate),

      then(() => NI_Next.of(data)),

      _catch((error: any) => Done.of({ data, error }))
    )();

export const makePhotoDataAndSendToDbOnAdd =
  makePhotoDataAndSendToDbOnAdd_(updatePhoto);

////////////////////////////////////////

export const makePhotoDataAndSendToDbOnEdit_ =
  (updatePhoto: PhotosDbService["updatePhoto"]) => (data: EditPhotoData) =>
    compose<EditPhotoData, Promise<NI_Next<EditPhotoData> | Done>>(
      () => makePhotoFieldsToUpdateOnEdit(data),

      (fieldsToUpdate: PhotoFieldsToUpdateOnEdit) =>
        updatePhoto(data.reqInfo.photoId, fieldsToUpdate),

      then(() => NI_Next.of(data)),

      _catch((error: any) => Done.of({ data, error }))
    )();

export const makePhotoDataAndSendToDbOnEdit =
  makePhotoDataAndSendToDbOnEdit_(updatePhoto);

///////////////////////////////////////////////

export const savePhotoToOriginalPhotoStorage_ =
  (
    saveToGoogleDrive: OriginalPhotoStoreService["save"],
    updatePhoto: PhotosDbService["updatePhoto"],
    removePhoto: FsService["removePhoto"]
  ) =>
  async (data: AddPhotoData) => {
    compose<AddPhotoData, Promise<NI_Next<AddPhotoData>>>(
      () =>
        saveToGoogleDrive(
          data.reqInfo.photoFile.filename,
          data.reqInfo.photoFile.path
        ),

      then((googlePhotoInfo: { id: string; name: string }) =>
        updatePhoto(data.reqInfo.photoId, {
          googleDriveId: googlePhotoInfo.id,
        })
      ),
      // remove upload photo on okey
      then(() => removePhoto(data.reqInfo.photoFile.path)),

      _catch((err: any) => {
        console.error(
          `Error on save photo to google drive ${err.message} | ${data.reqInfo.photoFile.filename} | ${data.reqInfo.photoFile.originalname} |`
        );
      })
    )();
  };

export const savePhotoToOriginalPhotoStorage = savePhotoToOriginalPhotoStorage_(
  save,
  updatePhoto,
  removePhoto
);

/////////////////////////////////////////

export const updatePhotoOnOriginalPhotoStorage_ =
  (
    updateOnGoogleDrive: OriginalPhotoStoreService["update"],
    saveToGoogleDrive: OriginalPhotoStoreService["save"],
    updatePhoto: PhotosDbService["updatePhoto"],
    removePhoto: FsService["removePhoto"]
  ) =>
  async (data: EditPhotoData) => {
    compose<EditPhotoData, Promise<NI_Next<EditPhotoData>>>(
      () => isExists(data.prevGoogleDriveId as string),
      then(
        elif(
          (isExists: boolean | undefined) => isExists === true,
          () =>
            updateOnGoogleDrive(
              data.reqInfo.photoFile.filename,
              data.reqInfo.photoFile.path
            ),
          () =>
            saveToGoogleDrive(
              data.reqInfo.photoFile.filename,
              data.reqInfo.photoFile.path
            )
        )
      ),

      then((googlePhotoInfo: { id: string; name: string }) =>
        updatePhoto(data.reqInfo.photoId, {
          googleDriveId: googlePhotoInfo.id,
        })
      ),
      // remove upload photo on okey
      then(() => removePhoto(data.reqInfo.photoFile.path)),

      _catch((err: any) => {
        console.error(
          `Error on save photo to google drive ${err.message} | ${data.reqInfo.photoFile.filename} | ${data.reqInfo.photoFile.originalname} |`
        );
      })
    )();
  };

export const updatePhotoOnOriginalPhotoStorage =
  updatePhotoOnOriginalPhotoStorage_(update, save, updatePhoto, removePhoto);

////////////////////////////////////////

export const onErrorResponse_ =
  (
    makeBeautyErrorMsg: (
      data: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>,
      isEdit?: boolean
    ) => string,
    removePhoto: FsService["removePhoto"],
    removePhotos: FsService["removePhotos"],
    removePhotosFromWebStore: PhotosWebStoreService["removePhotos"]
  ) =>
  (response: Response, isEdit: boolean) =>
    compose<PhotoMiddlewareDone<AddPhotoData | EditPhotoData>, void>(
      tap((val: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) =>
        console.log(makeBeautyErrorMsg(val, isEdit))
      ),
      // remove upload file
      elif<
        PhotoMiddlewareDone<AddPhotoData | EditPhotoData>,
        PhotoMiddlewareDone<AddPhotoData | EditPhotoData>
      >(
        // @ts-ignore
        ({ data }: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) =>
          data.reqInfo !== undefined && data.reqInfo.photoFile !== undefined,
        tap(({ data }: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) =>
          removePhoto(data.reqInfo.photoFile.path)
        ),
        (val: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) => val
      ),
      // remove temp optimized photos
      elif<
        PhotoMiddlewareDone<AddPhotoData | EditPhotoData>,
        PhotoMiddlewareDone<AddPhotoData | EditPhotoData>
      >(
        // @ts-ignore
        ({ data }: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) =>
          data.optimizedPhotosPaths !== undefined,
        tap(({ data }: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) =>
          removePhotos([
            ...(data.optimizedPhotosPaths as Map<number, string>).values(),
          ])
        ),
        (val: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) => val
      ),
      // remove cloudinary images
      elif<
        PhotoMiddlewareDone<AddPhotoData | EditPhotoData>,
        PhotoMiddlewareDone<AddPhotoData | EditPhotoData>
      >(
        // @ts-ignore
        ({ data }: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) =>
          data.webImagesInfo !== undefined,
        tap(({ data }: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) =>
          removePhotosFromWebStore(data.webImagesInfo?.ids as string[])
        ),
        (val: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) => val
      ),
      // Do we need to delete prevPhotosWebStore ? Last error can be triggered on
      // update firestore record - it means
      // Do we need to delete file from google drive ?
      (val: PhotoMiddlewareDone<AddPhotoData | EditPhotoData>) => {
        // return response json
        return response
          .status(200)
          .json({
            status: "error",
            data: {},
          })
          .end();
      }
    );

export const onErrorResponse = onErrorResponse_(
  makeBeautyErrorMsg,
  removePhoto,
  removePhotos,
  removePhotosFromWebStore
);

///////////////////////////////////////////

export const onSuccessResponseOnAdd_ =
  (removePhotos: FsService["removePhotos"]) =>
  (response: Response) =>
  (data: AddPhotoData | EditPhotoData) => {
    // clean temp optimized photos
    removePhotos([
      ...(data.optimizedPhotosPaths as Map<number, string>).values(),
    ]);

    // remove upload file in saveToGoogleDrive(after done)

    console.log(`---------SUCCESS ADD PHOTO-----------`);
    console.log(data);
    console.log("---------------------------");

    return response
      .status(200)
      .json({
        status: "success",
        data: {},
      })
      .end();
  };

export const onSuccessResponseOnAdd = onSuccessResponseOnAdd_(removePhotos);

////////////////////////////

export const onSuccessResponseOnEdit_ =
  (
    removePhotos: FsService["removePhotos"],
    removePhotosFromWebStore: PhotosWebStoreService["removePhotos"]
  ) =>
  (response: Response) =>
  (data: EditPhotoData) => {
    // clean temp optimized photos
    removePhotos([
      ...(data.optimizedPhotosPaths as Map<number, string>).values(),
    ]);

    // remove upload file in saveToGoogleDrive(after done)

    // remove prev cloudinary images
    removePhotosFromWebStore(data.prevWebImagesIds as string[]);

    console.log(`---------SUCCESS EDIT PHOTO-----------`);
    console.log(data);
    console.log("---------------------------");

    return response
      .status(200)
      .json({
        status: "success",
        data: {},
      })
      .end();
  };

export const onSuccessResponseOnEdit = onSuccessResponseOnEdit_(
  removePhotos,
  removePhotosFromWebStore
);
