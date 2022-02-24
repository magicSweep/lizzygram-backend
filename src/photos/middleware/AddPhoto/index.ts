import {
  checkFirestoreRecordOnAdd,
  makeOptimizedPhotosAndBase64String,
  makePhotoInfoAndPathsToOptimizedPhotos,
  uploadPhotosToPhotosWebStorage,
  makePhotoDataAndSendToDbOnAdd,
  savePhotoToOriginalPhotoStorage,
  onSuccessResponseOnAdd,
  onErrorResponse,
} from "./../../controller";
import { addPhotoMiddleware as addPhotoMiddleware_ } from "./addPhoto";

export const addPhotoMiddleware = addPhotoMiddleware_(
  checkFirestoreRecordOnAdd,
  makePhotoInfoAndPathsToOptimizedPhotos,
  makeOptimizedPhotosAndBase64String,
  uploadPhotosToPhotosWebStorage,
  makePhotoDataAndSendToDbOnAdd,
  savePhotoToOriginalPhotoStorage,
  onErrorResponse,
  onSuccessResponseOnAdd
);
