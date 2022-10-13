/* import {
  init as initDrive,
  isFileExists,
  uploadImage,
  updateImageFile,
  downloadImage,
  deleteFile,
} from "./../../../service/googleDrive"; */
import {
  init as initDrive,
  isFileExists,
  uploadImage,
  updateImageFile,
  downloadImage,
  downloadImageStream as downloadImageStream_,
  deleteFile,
} from "magic-data/google.drive";
import { Path } from "../../../types";
import { Logger } from "winston";

export const init = (logger: Logger) => initDrive(logger);

export const isExists = (photoId: string) => {
  return isFileExists(photoId);
};

export const save = (photoFileName: string, pathToPhoto: Path) => {
  return uploadImage(photoFileName, pathToPhoto);
  //this.googleDriveId = "";
};

export const update = (googleDriveId: string, pathToPhoto: Path) => {
  return updateImageFile(googleDriveId, pathToPhoto);
  //this.googleDriveId = "";
};

export const download = (fileId: string, destPath: Path) => {
  return downloadImage(fileId, destPath);
};

//deleteFile
export const remove = deleteFile;

export const downloadImageStream = downloadImageStream_;
