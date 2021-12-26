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
import { EditPhotoData } from "../../../types";

import {
  checkFirestoreRecordOnEditAndCollectWebIds,
  makeOptimizedPhotosAndBase64String,
  makePhotoInfoAndPathsToOptimizedPhotos,
  uploadPhotosToPhotosWebStorage,
  makePhotoDataAndSendToDbOnEdit,
  updatePhotoOnOriginalPhotoStorage,
  onSuccessResponseOnEdit,
  onErrorResponse,
} from "./../Photos.controller";

export const editPhotoMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) =>
  compose<unknown, EditPhotoData>(
    // Get request params
    () =>
      req.file === undefined
        ? Done.of({ data: {}, error: `We have no photo file...` })
        : NI_Next.of<EditPhotoData>({
            reqInfo: {
              photoFile: req.file as any,
              photoId: req.body.photoId,
              userUid: req.body.userUid,
              date: req.body.date,
              tags: req.body.tags,
              description: req.body.description,
            },
          }),
    // We make validation OF REQ PARAMS(photoId, userUid, photoFile) in multer fileFilter
    // But if in request we do not get file - multer do not make fileFilter validation at all
    /* chain((data: EditPhotoData) =>
      data.reqInfo.photoFile === undefined
        ? Done.of({ data, error: `We have no photo file...` })
        : NI_Next.of(data)
    ), */
    // Check firestore record with that photoId
    chain(checkFirestoreRecordOnEditAndCollectWebIds),
    // make photo metricks info and paths to optimized photos
    then(chain(makePhotoInfoAndPathsToOptimizedPhotos)),
    // make optimized by width photos and base 64 string
    then(chain(makeOptimizedPhotosAndBase64String)),
    // upload files to cloudinary
    then(chain(uploadPhotosToPhotosWebStorage)),
    // make photo data and add it in to firestore
    then(chain(makePhotoDataAndSendToDbOnEdit)),
    // save original photo to google drive and update googleDriveId field on firestore
    then(map(tap(updatePhotoOnOriginalPhotoStorage))),
    // clean up and send error or success response
    thenDoneFlat(fold(onErrorResponse(res, true), onSuccessResponseOnEdit(res)))
  )();
