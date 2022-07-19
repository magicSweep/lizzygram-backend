import { NextFunction, Request, Response } from "express";
import {
  compose,
  NI_Next,
  Done,
  chain,
  then,
  _catch,
  map,
  tap,
  elif,
  thenDoneFold,
  toOne,
} from "fmagic";
import { MainData } from "./types";

import { Logger } from "winston";
import {
  MakePhotoInfo,
  MakeOptimizedPhotosAndSaveToWeb,
  MakeBase64,
  SavePhotoToOriginalPhotoStorage,
} from "./types";
import { CleanUp, FullCleanUp } from "../../controller/CleanUp/types";
import {
  ImgExt,
  MainResponseData,
  WebImagesInfo,
} from "lizzygram-common-data/dist/types";

export const mainMiddleware_ =
  (
    savePhotoToOriginalPhotoStorage: SavePhotoToOriginalPhotoStorage,
    makePhotoInfo: MakePhotoInfo,
    makeOptimizedPhotosAndSaveToWeb: MakeOptimizedPhotosAndSaveToWeb,
    //makePhotoDataAndSendToDbOnAdd: MakePhotoDataAndSendToDbOnAdd,
    makeBase64: MakeBase64,
    cleanUp: CleanUp,
    fullCleanUp: FullCleanUp
  ) =>
  (logger: Logger) =>
  async (req: Request, res: Response, next: NextFunction) =>
    compose<unknown, MainData>(
      () =>
        NI_Next.of({
          reqInfo: {
            photoFile: req.file as any,
          },
        }),
      //map(tap((data: MainData) => console.log("---------------STAGE 0", data))),
      chain(
        compose(
          (data: MainData) =>
            Promise.all([
              compose(
                makePhotoInfo,
                then(
                  chain((data: MainData) =>
                    Promise.all([
                      makeOptimizedPhotosAndSaveToWeb(data),
                      makeBase64(data),
                    ])
                  )
                ),
                then(toOne)
              )(data),
              savePhotoToOriginalPhotoStorage(data),
            ]),
          then(toOne)
        )
      ),
      thenDoneFold(
        // ON ERROR
        compose(
          tap(() => {
            // send response
            res.status(418).end();
          }),
          tap((data: MainData) =>
            logger.log("error", `MAIN MIDDLEWARE ERROR`, {
              data,
            })
          ),
          tap(fullCleanUp(logger))
        ),
        // ON SUCCESS
        compose(
          tap((data: MainData) => {
            const resData: MainResponseData = {
              base64: data.base64String as string,
              aspectRatio: data.photoInfo?.aspectRatio as number,
              imageExtention: data.photoInfo?.imageExtention as ImgExt,
              googleDriveId: data.googleDriveId as string,
              webImagesInfo: {
                ids: data.webImagesInfo?.ids as string[],
                urls: [...(data.webImagesInfo?.urls as Map<any, any>)] as any,
              },
            };
            // send response
            res
              .status(200)
              .json({
                data: resData,
              })
              .end();
          }),
          tap((data: MainData) =>
            logger.log("info", `MAKE MIDDLEWARE SUCCESS`, {
              DATA: data,
            })
          ),
          tap(cleanUp(logger))
        )
      )
    )();

// make photoInfo
// then parralel - makeBase64 | makeOptimizePhotos + saveToWebStorage
/* export const makeMiddleware_ =
  (
    //checkFirestoreRecordOnAdd: CheckFirestoreRecordOnAdd,
    makeOptimizedPhotos: MakeOptimizedPhotos,
    uploadPhotosToPhotosWebStorage: UploadPhotosToPhotosWebStorage,
    //makePhotoDataAndSendToDbOnAdd: MakePhotoDataAndSendToDbOnAdd,
    savePhotoToOriginalPhotoStorage: SavePhotoToOriginalPhotoStorage,
    cleanUp: CleanUp
  ) =>
  (logger: Logger) =>
  async (req: Request, res: Response, next: NextFunction) =>
    compose<unknown, WorkerPhotoData>(
      () =>
        NI_Next.of({
          reqInfo: {
            photoFile: req.file as any,
          },
        }),
      map(tap((data: any) => console.log("---------------STAGE 0", data))),
      chain(
        compose(
          (data: WorkerPhotoData) =>
            Promise.all([
              compose(
                makeOptimizedPhotos(logger),
                then(
                  map(
                    tap((data: any) =>
                      console.log("---------------STAGE 2", data)
                    )
                  )
                ),
                then(chain(uploadPhotosToPhotosWebStorage)),
                then(
                  map(
                    tap((data: any) =>
                      console.log("---------------STAGE 3", data)
                    )
                  )
                )
              )(data),
              savePhotoToOriginalPhotoStorage(data),
            ]),
          then(tap((data: any) => console.log("---------------STAGE 4", data))),
          then(
            elif(
              (results: [Done | NI_Next<any>, Done | NI_Next<any>]) =>
                results[0].__IS_DONE === true || results[1].__IS_DONE === true,
              (results: any[]) =>
                Done.of({
                  ...results[0].value,
                  ...results[1].value,
                }),
              (results: any[]) =>
                NI_Next.of({
                  ...results[0].value,
                  ...results[1].value,
                })
            )
          )
        )
      ),
      thenDoneFold(
        // ON ERROR
        compose(
          tap(() => {
            // send response
            res.status(418).end();
          }),
          tap((val: WorkerPhotoData) =>
            logger.log("error", `MAKE MIDDLEWARE ERROR`, {
              INFO: val,
            })
          ),
          tap(cleanUp)
        ),
        // ON SUCCESS
        (data: WorkerPhotoData) => {
          res
            .status(200)
            .json({
              data: {
                base64: data.base64String,
                aspectRatio: data.photoInfo?.aspectRatio,
                imageExtention: data.photoInfo?.imageExtention,
                googleDriveId: data.googleDriveId,
                webStorageFilesIds: data.webImagesInfo?.ids,
                webStorageFilesUrls: data.webImagesInfo?.urls,
              },
            })
            .end();

          // clean up we make on external /cleanup request

          logger.log("info", "SUCCESS ADD PHOTO", {
            DATA: data,
          });
        }
      )
    )();
 */
