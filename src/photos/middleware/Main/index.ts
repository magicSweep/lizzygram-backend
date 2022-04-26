import { cleanUp, fullCleanUp } from "../../controller/CleanUp";
import {
  makeBase64,
  makeOptimizedPhotosAndSaveToWeb,
  makePhotoInfo,
  savePhotoToOriginalPhotoStorage,
} from "./controller";
import { mainMiddleware_ } from "./main";

export const mainMiddleware = mainMiddleware_(
  savePhotoToOriginalPhotoStorage,
  makePhotoInfo,
  makeOptimizedPhotosAndSaveToWeb,
  //makePhotoDataAndSendToDbOnAdd: MakePhotoDataAndSendToDbOnAdd,
  makeBase64,
  cleanUp,
  fullCleanUp
);
