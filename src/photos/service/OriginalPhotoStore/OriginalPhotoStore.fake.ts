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
  deleteFile,
} from "magic-data/google.drive";
import { Path } from "../../../types";
import { Logger } from "winston";
import wait from "waait";
import { createReadStream } from "fs";
import { join } from "path";

export const init = (logger: Logger) => {};

export const isExists = async (photoId: string) => {
  await wait(2000);

  return true;
};

export const save = async (photoFileName: string, pathToPhoto: Path) => {
  await wait(2000);

  console.log("[FAKE SAVE PHOTO TO GOOGLE DRIVE]", photoFileName, pathToPhoto);

  const id = Math.floor(Math.random() * 100000);

  return {
    id: `super-id-${id}`,
    name: `super-name-${id}`,
  };
};

export const update = async (googleDriveId: string, pathToPhoto: Path) => {
  await wait(2000);

  const id = Math.floor(Math.random() * 100000);

  return {
    id: `super-id-${id}`,
    name: `super-name-${id}`,
  };
};

export const download = async (fileId: string, destPath: Path) => {
  await wait(2000);
};

//deleteFile
export const remove = async (fileId: string) => {
  console.log("[FAKE REMOVE PHOTO FROM GOOGLE DRIVE]", fileId);

  await wait(2000);
};

export const downloadImageStream = async (fileId: string) => {
  await wait(1000);

  console.log("[FAKE DOWNLOAD IMAGE STREAM FROM GOOGLE DRIVE]", fileId);

  const pathToPhoto = join(process.cwd(), "src", "static", "12.jpg");
  const readStream = createReadStream(pathToPhoto);

  return readStream;
};
