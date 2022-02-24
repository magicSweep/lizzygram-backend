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
  makePhotoFieldsToUpdateOnEdit,
} from "./Photos.helper";
import { photoSizes } from "../../config";
import {
  checkFirestoreRecordOnAdd_,
  checkFirestoreRecordOnEditAndCollectWebIds_,
  makePhotoInfoAndPathsToOptimizedPhotos_,
  makeOptimizedPhotosAndBase64String_,
  uploadPhotosToPhotosWebStorage_,
  makePhotoDataAndSendToDbOnAdd_,
  makePhotoDataAndSendToDbOnEdit_,
  savePhotoToOriginalPhotoStorage_,
  updatePhotoOnOriginalPhotoStorage_,
  onErrorResponse_,
  onSuccessResponseOnAdd_,
  onSuccessResponseOnEdit_,
} from "./Photos.controller";
import {
  CheckFirestoreRecordOnAdd,
  CheckFirestoreRecordOnEditAndCollectWebIds,
  MakeOptimizedPhotosAndBase64String,
  MakePhotoInfoAndPathsToOptimizedPhotos,
  UploadPhotosToPhotosWebStorage,
  MakePhotoDataAndSendToDbOnAdd,
  MakePhotoDataAndSendToDbOnEdit,
  SavePhotoToOriginalPhotoStorage,
  UpdatePhotoOnOriginalPhotoStorage,
  OnSuccessResponseOnAdd,
  OnSuccessResponseOnEdit,
  OnErrorResponse,
} from "./types";

export const checkFirestoreRecordOnAdd: CheckFirestoreRecordOnAdd =
  checkFirestoreRecordOnAdd_(getPhoto, isValidPhotoDbRecordOnAdd);

export const checkFirestoreRecordOnEditAndCollectWebIds: CheckFirestoreRecordOnEditAndCollectWebIds =
  checkFirestoreRecordOnEditAndCollectWebIds_(
    getPhoto,
    isValidPhotoDbRecordOnEdit
  );

export const makePhotoInfoAndPathsToOptimizedPhotos: MakePhotoInfoAndPathsToOptimizedPhotos =
  makePhotoInfoAndPathsToOptimizedPhotos_(getPhotoInfo, makePaths);

export const makeOptimizedPhotosAndBase64String: MakeOptimizedPhotosAndBase64String =
  makeOptimizedPhotosAndBase64String_(
    makeOptimizedByWidthPhotoFiles,
    makeBase64String,
    photoSizes
  );

export const uploadPhotosToPhotosWebStorage: UploadPhotosToPhotosWebStorage =
  uploadPhotosToPhotosWebStorage_(uploadPhotos, makeWebImagesInfo);

export const makePhotoDataAndSendToDbOnAdd: MakePhotoDataAndSendToDbOnAdd =
  makePhotoDataAndSendToDbOnAdd_(makePhotoFieldsToUpdateOnAdd, updatePhoto);

export const makePhotoDataAndSendToDbOnEdit: MakePhotoDataAndSendToDbOnEdit =
  makePhotoDataAndSendToDbOnEdit_(makePhotoFieldsToUpdateOnEdit, updatePhoto);

export const savePhotoToOriginalPhotoStorage: SavePhotoToOriginalPhotoStorage =
  savePhotoToOriginalPhotoStorage_(save, updatePhoto, removePhoto);

export const updatePhotoOnOriginalPhotoStorage: UpdatePhotoOnOriginalPhotoStorage =
  updatePhotoOnOriginalPhotoStorage_(
    update,
    save,
    updatePhoto,
    removePhoto,
    isExists
  );

export const onErrorResponse: OnErrorResponse = onErrorResponse_(
  //makeBeautyErrorMsg,
  removePhoto,
  removePhotos,
  removePhotosFromWebStore
);

export const onSuccessResponseOnAdd: OnSuccessResponseOnAdd =
  onSuccessResponseOnAdd_(removePhotos);

export const onSuccessResponseOnEdit: OnSuccessResponseOnEdit =
  onSuccessResponseOnEdit_(removePhotos, removePhotosFromWebStore);
