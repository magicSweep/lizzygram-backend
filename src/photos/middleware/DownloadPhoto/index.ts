import {
  downloadImage,
  downloadImageStream,
} from "../../../service/googleDrive";
//import { exists as userExists } from "../../photos/service/UserDb";
//import { isValidPhotoQuery } from "../../service/Validator";
import { downloadPhotoMiddleware_ } from "./downloadPhoto";

// WE CREATE THIS EXTRA FILE
// CAUSE JEST DO NOT WORK WITH FIREBASE IMPORTS LIKE "firebase-admin/app"
export const downloadPhotoMiddleware = downloadPhotoMiddleware_(
  //isValidPhotoQuery,
  //userExists,
  downloadImageStream
);

export { validateReqParams } from "./download.validate";
