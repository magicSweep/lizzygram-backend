import { removePhoto, removePhotos } from "../../../service/Fs";
import { cleanUp_, fullCleanUp_, storagesCleanUp_ } from "./CleanUp.service";
import { removePhotos as removePhotosFromWebStore } from "../../service/PhotosWebStore/PhotosWebStore.fake";
import { remove as removePhotosFromGoogleDrive } from "../../service/OriginalPhotoStore/OriginalPhotoStore.fake";

export const cleanUp = cleanUp_(removePhoto, removePhotos);

export const storagesCleanUp = storagesCleanUp_(
  removePhotosFromWebStore,
  removePhotosFromGoogleDrive
);

export const fullCleanUp = fullCleanUp_(cleanUp, storagesCleanUp);
