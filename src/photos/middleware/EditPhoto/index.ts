import {
  checkFirestoreRecordOnEditAndCollectWebIds,
  makeOptimizedPhotosAndBase64String,
  makePhotoInfoAndPathsToOptimizedPhotos,
  uploadPhotosToPhotosWebStorage,
  makePhotoDataAndSendToDbOnEdit,
  updatePhotoOnOriginalPhotoStorage,
  onSuccessResponseOnEdit,
  onErrorResponse,
} from "./../../controller";
import { editPhotoMiddleware as editPhotoMiddleware_ } from "./editPhoto";

export const editPhotoMiddleware = editPhotoMiddleware_(
  checkFirestoreRecordOnEditAndCollectWebIds,
  makePhotoInfoAndPathsToOptimizedPhotos,
  makeOptimizedPhotosAndBase64String,
  uploadPhotosToPhotosWebStorage,
  makePhotoDataAndSendToDbOnEdit,
  updatePhotoOnOriginalPhotoStorage,
  onErrorResponse,
  onSuccessResponseOnEdit
);
