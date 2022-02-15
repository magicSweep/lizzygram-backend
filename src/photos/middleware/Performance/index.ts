// IT MIDDLEWARE ONLY FOR TEST PERFORMANCE

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
  Path,
  Width,
  PhotoInfo,
  WebImageInfo,
  TransformedImageInfo,
  AddPhotoData,
  WebImagesInfo,
  PhotoFieldsToUpdateOnAdd,
  PhotoMiddlewareDone,
} from "../../../types";
/* import * as validator from "../service/Validator";
import * as photoDb from "../service/PhotosDb";
import * as fs from "../service/Fs";
import { save as saveToGoogleDrive } from "../service/OriginalPhotoStore";
//import { getPhotoInfo, makePaths, makeOptimizedByWidthPhotoFiles, makeBase64String } from "../service/PhotoTransformations";
import * as photoTransformations from "../service/PhotoTransformations";
import * as photosWebStore from "../service/PhotosWebStore";
import { photoSizes } from "../../config";
import {
  makePhotoFieldsToUpdateOnAdd,
  makeBeautyErrorMsg,
} from "./addPhoto.helper"; */
import {
  checkFirestoreRecordOnAdd,
  makeOptimizedPhotosAndBase64String,
  makePhotoInfoAndPathsToOptimizedPhotos,
  uploadPhotosToPhotosWebStorage,
  makePhotoDataAndSendToDbOnAdd,
  savePhotoToOriginalPhotoStorage,
  onSuccessResponseOnAdd,
  onErrorResponse,
} from "./../Photos.controller";
import { Logger } from "winston";

export const performanceMiddleware =
  (logger: Logger) => async (req: Request, res: Response, next: NextFunction) =>
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
      // make photo metricks info and paths to optimized photos
      chain(makePhotoInfoAndPathsToOptimizedPhotos),
      then(map(tap((data: any) => console.log("STAGE 1", data)))),
      // make optimized by width photos and base 64 string
      then(chain(makeOptimizedPhotosAndBase64String)),
      then(map(tap((data: any) => console.log("STAGE 2", data)))),
      // upload files to cloudinary
      then(chain(uploadPhotosToPhotosWebStorage)),
      then(map(tap((data: any) => console.log("STAGE 3", data)))),
      // clean up and send error or success response
      thenDoneFlat(
        fold(
          onErrorResponse(res, logger, false),
          onSuccessResponseOnAdd(res, logger)
        )
      )
    )();
