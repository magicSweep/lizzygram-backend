import {
  compose,
  NI_Next,
  Done,
  then,
  _catch,
  tap,
  elif,
  Next,
  chain,
  map,
} from "fmagic";
import {
  Path,
  PhotoInfo,
  TransformedImageInfo,
  Width,
} from "../../../../types";
import { PhotosWebStore } from "../../../service/PhotosWebStore/types";
import {
  //PhotoFieldsToUpdateOnAdd,
  PhotoTransformations,
  //ValidatorService,
  //PhotoFieldsToUpdateOnEdit,
} from "../../../service/PhotoTransformations/types";
import { MainData } from "./../types";
import { OriginalPhotoStore } from "./../../../service/OriginalPhotoStore/types";

///////////////////////////////////////////

// make photoInfo
// then parralel - makeBase64 | makeOptimizePhotos + saveToWebStorage

export const savePhotoToOriginalPhotoStorage_ =
  (
    saveToGoogleDrive: OriginalPhotoStore["save"]
    //updatePhoto: PhotosDbService["updatePhoto"],
    //removePhoto: FsService["removePhoto"]
  ) =>
  //(logger: Logger) =>
  async (data: MainData) =>
    compose<MainData, Promise<NI_Next<MainData>>>(
      () =>
        saveToGoogleDrive(
          data.reqInfo.photoFile.filename,
          data.reqInfo.photoFile.path
        ),

      then((googlePhotoInfo: { id: string; name: string }) =>
        NI_Next.of({
          googleDriveId: googlePhotoInfo.id,
        })
      ),

      /*  then((googlePhotoInfo: { id: string; name: string }) =>
      updatePhoto(data.reqInfo.photoId, {
        googleDriveId: googlePhotoInfo.id,
      })
    ),
    // remove upload photo on okey
    then(() => removePhoto(data.reqInfo.photoFile.path)), */

      _catch(
        (err: any) =>
          Done.of({
            error: err,
          }) /* {
       logger.log("error", "Error on save photo to google drive", {
        error: err,
        photoFile: data.reqInfo.photoFile,
      }); 
    } */
      )
    )();

export const makePhotoInfo_ =
  (getPhotoInfo: PhotoTransformations["makePhotoInfo"]) => (data: MainData) =>
    compose<MainData, Promise<NI_Next<MainData> | Done>>(
      async () => ({
        ...data,
        photoInfo: await getPhotoInfo(data.reqInfo.photoFile.path),
        //optimizedPhotosPaths: makePaths(data.reqInfo.photoFile.filename),
      }),
      //then(tap((data: any) => console.log("TAAAAAPP", data))),
      then(NI_Next.of),
      _catch((err: any) => {
        //console.log("---------EEERRRRORORRR", err);
        return Done.of({ ...data, error: err });
      })
    )();

export const makeBase64_ =
  (makeBase64String: PhotoTransformations["makeBase64"]) => (data: MainData) =>
    compose<MainData, Promise<NI_Next<MainData> | Done>>(
      async () => ({
        ...data,
        base64String: await makeBase64String(
          data.reqInfo.photoFile.path,
          data.photoInfo?.isInverted as boolean
        ),
        //optimizedPhotosPaths: makePaths(data.reqInfo.photoFile.filename),
      }),
      //then(tap((data: any) => console.log("TAAAAAPP", data))),
      then(NI_Next.of),
      _catch((err: any) => {
        //console.log("---------EEERRRRORORRR", err);
        return Done.of({ ...data, error: err });
      })
    )();

/*  () =>
        Promise.all([
          makeOptimizedPhotos(
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
      then( */

export const makeOptimizedPhotosAndSaveToWeb_ =
  (
    makeOptimizedPhotos: PhotoTransformations["makeOptimizedPhotos"],
    uploadPhotos: PhotosWebStore["uploadPhotos"]
    //makeBase64String: PhotoTransformationsService["makeBase64String"],
    //photoSizes: { width: number; height: number }[]
  ) =>
  (data: MainData) =>
    compose<MainData, Promise<NI_Next<MainData> | Done>>(
      //tap((data: any) => console.log("DATA ---- ", data)),
      async () => {
        const resultData = await makeOptimizedPhotos({
          currentPhotoSize: {
            height: (data.photoInfo as PhotoInfo).height,
            width: (data.photoInfo as PhotoInfo).width,
          },
          isInverted: (data.photoInfo as PhotoInfo).isInverted,
          pathToOriginalImage: data.reqInfo.photoFile.path,
          photoFileName: data.reqInfo.photoFile.filename,
        });

        return {
          ...data,
          ...resultData,
        };
      },

      /*  ({
        ...data,
        optimizedImageInfo: await makeOptimizedPhotos({
          currentPhotoSize: {
            height: (data.photoInfo as PhotoInfo).height,
            width: (data.photoInfo as PhotoInfo).width,
          },
          isInverted: (data.photoInfo as PhotoInfo).isInverted,
          pathToOriginalImage: data.reqInfo.photoFile.path,
          photoFileName: data.reqInfo.photoFile.filename,
        }), */
      then(async (data: MainData) => ({
        ...data,
        webImagesInfo: await uploadPhotos(
          [...(data.optimizedPhotosPaths as Map<Width, Path>).values()],
          data.optimizedPhotosPaths as Map<Width, Path>
        ),
      })),
      then(NI_Next.of),
      _catch((error: any) => Done.of({ ...data, error }))
    )();

/* export const makePhotoInfoAndPathsToOptimizedPhotos_ =
  (
    getPhotoInfo: PhotoTransformationsService["getPhotoInfo"],
    makePaths: PhotoTransformationsService["makePaths"]
  ) =>
  (data: WorkerPhotoData) =>
    compose<WorkerPhotoData, Promise<NI_Next<WorkerPhotoData> | Done>>(
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
  (data: WorkerPhotoData) =>
    compose<WorkerPhotoData, Promise<NI_Next<WorkerPhotoData> | Done>>(
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
    )(); */
