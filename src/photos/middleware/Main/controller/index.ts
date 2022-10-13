import { uploadPhotos } from "../../../service/PhotosWebStore/PhotosWebStore.fake";
import {
  makeBase64 as makeBase64String,
  makeOptimizedPhotos,
} from "../../../service/PhotoTransformations";
import { makePhotoInfo as getPhotoInfo } from "../../../service/PhotoTransformations";
import {
  makePhotoInfo_,
  makeBase64_,
  makeOptimizedPhotosAndSaveToWeb_,
  savePhotoToOriginalPhotoStorage_,
} from "./main.controller";
import { save as saveToGoogleDrive } from "../../../service/OriginalPhotoStore/OriginalPhotoStore.fake";

export const makeOptimizedPhotosAndSaveToWeb = makeOptimizedPhotosAndSaveToWeb_(
  makeOptimizedPhotos,
  uploadPhotos
);

export const makeBase64 = makeBase64_(makeBase64String);

export const makePhotoInfo = makePhotoInfo_(getPhotoInfo);

export const savePhotoToOriginalPhotoStorage =
  savePhotoToOriginalPhotoStorage_(saveToGoogleDrive);
