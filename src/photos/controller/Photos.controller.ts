import { Response } from "express";
import { compose, NI_Next, Done, then, _catch, tap, elif, Next } from "fmagic";
import {
  Path,
  Width,
  PhotoInfo,
  WebImageInfo,
  TransformedImageInfo,
  AddPhotoData,
  EditPhotoData,
  WebImagesInfo,
  PhotoFieldsToUpdateOnAdd,
  FsService,
  OriginalPhotoStoreService,
  PhotosDbService,
  PhotosWebStoreService,
  PhotoTransformationsService,
  ValidatorService,
  PhotoFieldsToUpdateOnEdit,
} from "../../types";
import { Photo, FirestoreDate } from "lizzygram-common-data/dist/types";
import {
  makePhotoFieldsToUpdateOnAdd as makePhotoFieldsToUpdateOnAdd_,
  makePhotoFieldsToUpdateOnEdit as makePhotoFieldsToUpdateOnEdit_,
} from "./Photos.helper";
import { Logger } from "winston";

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
          ? Done.of({ ...data, error: valid })
          : NI_Next.of(data)
      ),
      _catch((err: any) => Done.of({ ...data, error: err }))
    )();

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
            ? Done.of({ ...data, error: valid })
            : NI_Next.of({
                ...data,
                prevWebImagesIds: photo.files,
                prevGoogleDriveId: photo.googleDriveId,
              })
      ),
      _catch((err: any) => Done.of({ ...data, error: err }))
    )();

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
        //console.log("---------EEERRRRORORRR", err);
        return Done.of({ ...data, error: err });
      })
    )();

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
      _catch((error: any) => Done.of({ ...data, error }))
    )();

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
      then((webImagesInfo: WebImagesInfo) =>
        NI_Next.of({
          ...data,
          webImagesInfo,
        })
      ),
      _catch((error: any) => Done.of({ ...data, error }))
    )();

//////////////////////////////////////

/* const tryCatch = (try_: any, catch_: any) => (val: any) => {
  try {
    return try_(val);
  } catch (err) {
    return catch_(err);
  }
};

export const makePhotoDataAndSendToDbOnAdd_ =
  (
    makePhotoFieldsToUpdateOnAdd: typeof makePhotoFieldsToUpdateOnEdit_,
    updatePhoto: PhotosDbService["updatePhoto"]
  ) =>
  (data: AddPhotoData) =>
    compose<AddPhotoData, Promise<NI_Next<AddPhotoData> | Done>>(
      tryCatch(
        () => NI_Next.of(makePhotoFieldsToUpdateOnAdd(data)),
        (err: any) =>
          Done.of({
            ...data,
            error: err,
          })
      ),

      chain((fieldsToUpdate: PhotoFieldsToUpdateOnAdd) =>
        updatePhoto(data.reqInfo.photoId, fieldsToUpdate)
      ),

      then(() => NI_Next.of(data)),

      _catch((error: any) => Done.of({ ...data, error }))
    )(); */

export const makePhotoDataAndSendToDbOnAdd_ =
  (
    makePhotoFieldsToUpdateOnAdd: typeof makePhotoFieldsToUpdateOnAdd_,
    updatePhoto: PhotosDbService["updatePhoto"]
  ) =>
  (data: AddPhotoData) =>
    compose<AddPhotoData, Promise<NI_Next<AddPhotoData> | Done>>(
      () => makePhotoFieldsToUpdateOnAdd(data),

      (fieldsToUpdate: PhotoFieldsToUpdateOnAdd) =>
        updatePhoto(data.reqInfo.photoId, fieldsToUpdate),

      then(() => NI_Next.of(data)),

      _catch((error: any) => Done.of({ ...data, error }))
    )();

////////////////////////////////////////

export const makePhotoDataAndSendToDbOnEdit_ =
  (
    makePhotoFieldsToUpdateOnEdit: typeof makePhotoFieldsToUpdateOnEdit_,
    updatePhoto: PhotosDbService["updatePhoto"]
  ) =>
  (data: EditPhotoData) =>
    compose<EditPhotoData, Promise<NI_Next<EditPhotoData> | Done>>(
      () => makePhotoFieldsToUpdateOnEdit(data),

      (fieldsToUpdate: PhotoFieldsToUpdateOnEdit) =>
        updatePhoto(data.reqInfo.photoId, fieldsToUpdate),

      then(() => NI_Next.of(data)),

      _catch((error: any) => Done.of({ ...data, error }))
    )();

///////////////////////////////////////////////

export const savePhotoToOriginalPhotoStorage_ =
  (
    saveToGoogleDrive: OriginalPhotoStoreService["save"],
    updatePhoto: PhotosDbService["updatePhoto"],
    removePhoto: FsService["removePhoto"]
  ) =>
  (logger: Logger) =>
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
        logger.log("error", "Error on save photo to google drive", {
          error: err,
          photoFile: data.reqInfo.photoFile,
        });
      })
    )();
  };

/////////////////////////////////////////

export const updatePhotoOnOriginalPhotoStorage_ =
  (
    updateOnGoogleDrive: OriginalPhotoStoreService["update"],
    saveToGoogleDrive: OriginalPhotoStoreService["save"],
    updatePhoto: PhotosDbService["updatePhoto"],
    removePhoto: FsService["removePhoto"],
    isExists: (photoId: string) => Promise<boolean>
  ) =>
  (logger: Logger) =>
  async (data: EditPhotoData) => {
    compose<EditPhotoData, Promise<NI_Next<EditPhotoData>>>(
      () => isExists(data.prevGoogleDriveId as string),
      then(
        elif(
          (isExists: boolean | undefined) => isExists === true,
          () =>
            updateOnGoogleDrive(
              data.prevGoogleDriveId as string,
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
        logger.log("error", "Error on update photo on google drive", {
          error: err,
          photoFile: data.reqInfo.photoFile,
        });
      })
    )();
  };

////////////////////////////////////////

export const onErrorResponse_ =
  (
    /*  makeBeautyErrorMsg: (
      data: AddPhotoData | EditPhotoData,
      isEdit?: boolean
    ) => string, */
    removePhoto: FsService["removePhoto"],
    removePhotos: FsService["removePhotos"],
    removePhotosFromWebStore: PhotosWebStoreService["removePhotos"]
  ) =>
  (response: Response, logger: Logger, isEdit: boolean) =>
    compose<AddPhotoData | EditPhotoData, void>(
      tap((val: AddPhotoData | EditPhotoData) =>
        //console.log(makeBeautyErrorMsg(val, isEdit))

        //${isEdit === true ? "EDIT" : "ADD"} PHOTO ERROR
        logger.log("error", `${isEdit === true ? "EDIT" : "ADD"} PHOTO ERROR`, {
          INFO: val,
        })
      ),
      // remove upload file
      elif<any, any>(
        ({ reqInfo }: AddPhotoData | EditPhotoData) =>
          reqInfo !== undefined && reqInfo.photoFile !== undefined,
        tap(({ reqInfo }: AddPhotoData | EditPhotoData) =>
          removePhoto(reqInfo.photoFile.path)
        ),
        (val: AddPhotoData | EditPhotoData) => val
      ),
      // remove temp optimized photos
      elif<any, any>(
        ({ optimizedPhotosPaths }: AddPhotoData | EditPhotoData) =>
          optimizedPhotosPaths !== undefined,
        tap(({ optimizedPhotosPaths }: AddPhotoData | EditPhotoData) =>
          removePhotos([
            ...(optimizedPhotosPaths as Map<number, string>).values(),
          ])
        ),
        (val: AddPhotoData | EditPhotoData) => val
      ),
      // remove cloudinary images
      elif<any, any>(
        ({ webImagesInfo }: AddPhotoData | EditPhotoData) =>
          webImagesInfo !== undefined,
        tap(({ webImagesInfo }: AddPhotoData | EditPhotoData) =>
          removePhotosFromWebStore(webImagesInfo?.ids as string[])
        ),
        (val: AddPhotoData | EditPhotoData) => val
      ),
      // Do we need to delete prevPhotosWebStore ? Last error can be triggered on
      // update firestore record - it means
      // Do we need to delete file from google drive ?
      (val: AddPhotoData | EditPhotoData) => {
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

///////////////////////////////////////////

export const onSuccessResponseOnAdd_ =
  (removePhotos: FsService["removePhotos"]) =>
  (response: Response, logger: Logger) =>
  (data: AddPhotoData) => {
    // clean temp optimized photos
    removePhotos([
      ...(data.optimizedPhotosPaths as Map<number, string>).values(),
    ]);

    // remove upload file in saveToGoogleDrive(after done)

    logger.log("error", "SUCCESS ADD PHOTO", {
      DATA: data,
    });

    return response
      .status(200)
      .json({
        status: "success",
        data: {},
      })
      .end();
  };

////////////////////////////

export const onSuccessResponseOnEdit_ =
  (
    removePhotos: FsService["removePhotos"],
    removePhotosFromWebStore: PhotosWebStoreService["removePhotos"]
  ) =>
  (response: Response, logger: Logger) =>
  (data: EditPhotoData) => {
    // clean temp optimized photos
    removePhotos([
      ...(data.optimizedPhotosPaths as Map<number, string>).values(),
    ]);

    // remove upload file in saveToGoogleDrive(after done)

    // remove prev cloudinary images
    removePhotosFromWebStore(data.prevWebImagesIds as string[]);

    logger.log("error", "SUCCESS EDIT PHOTO", {
      DATA: data,
    });

    return response
      .status(200)
      .json({
        status: "success",
        data: {},
      })
      .end();
  };
