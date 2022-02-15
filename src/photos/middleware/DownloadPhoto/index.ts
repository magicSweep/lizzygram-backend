import { downloadImage } from "../../../googleDrive";
import { exists as userExists } from "../../service/UserDb";
import { isValidPhotoQuery } from "../../service/Validator";
import { downloadPhotoMiddleware_ } from "./downloadPhoto";
import { downloadImageStream } from "../../../googleDrive";

// WE CREATE THIS EXTRA FILE
// CAUSE JEST DO NOT WORK WITH FIREBASE IMPORTS LIKE "firebase-admin/app"
export const downloadPhotoMiddleware = downloadPhotoMiddleware_(
  isValidPhotoQuery,
  userExists,
  downloadImageStream
);
