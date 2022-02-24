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
  thenDoneFold,
} from "fmagic";
import { AddPhotoData } from "../../../types";
import {
  CheckFirestoreRecordOnAdd,
  MakeOptimizedPhotosAndBase64String,
  MakePhotoInfoAndPathsToOptimizedPhotos,
  UploadPhotosToPhotosWebStorage,
  MakePhotoDataAndSendToDbOnAdd,
  SavePhotoToOriginalPhotoStorage,
  OnSuccessResponseOnAdd,
  OnErrorResponse,
} from "./../../controller/types";
import { Logger } from "winston";

export const addPhotoMiddleware =
  (
    checkFirestoreRecordOnAdd: CheckFirestoreRecordOnAdd,
    makePhotoInfoAndPathsToOptimizedPhotos: MakeOptimizedPhotosAndBase64String,
    makeOptimizedPhotosAndBase64String: MakePhotoInfoAndPathsToOptimizedPhotos,
    uploadPhotosToPhotosWebStorage: UploadPhotosToPhotosWebStorage,
    makePhotoDataAndSendToDbOnAdd: MakePhotoDataAndSendToDbOnAdd,
    savePhotoToOriginalPhotoStorage: SavePhotoToOriginalPhotoStorage,
    onErrorResponse: OnErrorResponse,
    onSuccessResponseOnAdd: OnSuccessResponseOnAdd
  ) =>
  (logger: Logger) =>
  async (req: Request, res: Response, next: NextFunction) =>
    compose<unknown, AddPhotoData>(
      // Get request params
      () =>
        req.file === undefined
          ? Done.of({ data: {}, error: `We have no photo file...` })
          : NI_Next.of({
              reqInfo: {
                photoFile: req.file as any,
                photoId: req.body.photoId,
                userUid: req.body.userUid,
              },
            }),
      // We make validation OF REQ PARAMS(photoId, userUid, photoFile) in multer fileFilter
      // But if in request we do not get file - multer do not make fileFilter validation at all
      /* chain((data: AddPhotoData) =>
      data.reqInfo.photoFile === undefined
        ? Done.of({ data, error: `We have no photo file...` })
        : NI_Next.of(data)
    ), */
      map(
        tap((data: any) =>
          logger.log("info", "STAGE 0", {
            DATA: data,
          })
        )
      ),
      // Check firestore record with that photoId
      chain(checkFirestoreRecordOnAdd),
      // make photo metricks info and paths to optimized photos
      then(chain(makePhotoInfoAndPathsToOptimizedPhotos)),
      then(
        map(
          tap((data: any) =>
            logger.log("info", "STAGE 1", {
              DATA: data,
            })
          )
        )
      ),
      // make optimized by width photos and base 64 string
      then(chain(makeOptimizedPhotosAndBase64String)),
      then(
        map(
          tap((data: any) =>
            logger.log("info", "STAGE 2", {
              DATA: data,
            })
          )
        )
      ),
      // upload files to cloudinary
      then(chain(uploadPhotosToPhotosWebStorage)),
      then(
        map(
          tap((data: any) =>
            logger.log("info", "STAGE 3", {
              DATA: data,
            })
          )
        )
      ),
      // make photo data and add it in to firestore
      then(chain(makePhotoDataAndSendToDbOnAdd)),
      then(
        map(
          tap((data: any) =>
            logger.log("info", "STAGE 4", {
              DATA: data,
            })
          )
        )
      ),
      // save original photo to google drive and update googleDriveId field on firestore
      then(map(tap(savePhotoToOriginalPhotoStorage(logger)))),
      then(
        map(
          tap((data: any) =>
            logger.log("info", "STAGE 5", {
              DATA: data,
            })
          )
        )
      ),
      // clean up and send error or success response
      thenDoneFold(
        onErrorResponse(res, logger, false),
        onSuccessResponseOnAdd(res, logger)
      )
    )();
