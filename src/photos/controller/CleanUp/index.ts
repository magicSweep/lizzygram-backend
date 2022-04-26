import { removePhoto, removePhotos } from "../../../service/Fs";
import { cleanUp_, fullCleanUp_, storagesCleanUp_ } from "./CleanUp.controller";
import { removePhotos as removePhotosFromWebStore } from "../../service/PhotosWebStore";
import { remove as removePhotosFromGoogleDrive } from "../../service/OriginalPhotoStore";

export const cleanUp = cleanUp_(removePhoto, removePhotos);

export const storagesCleanUp = storagesCleanUp_(
  removePhotosFromWebStore,
  removePhotosFromGoogleDrive
);

export const fullCleanUp = fullCleanUp_(cleanUp, storagesCleanUp);
