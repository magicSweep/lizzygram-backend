import wait from "waait";
import { PhotosWebStore } from "./types";
import {
  Width,
  Path,
  PhotoWebId,
  WebSecureUrl,
  WebImageInfo,
} from "../../../types";

export const uploadPhotos: PhotosWebStore["uploadPhotos"] = async (
  pathsToPhotos: Path[],
  pathsByWidths: Map<Width, Path>
) => {
  /* 320, height: 180 },
    { width: 800, height: 640 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
    { width: 3840, 
    WebImagesInfo = {
        ids: string[];
        urls?: Map<number, string>;
    };*/

  console.log(
    "[FAKE UPLOAD PHOTOS TO CLOUDINARY]",
    JSON.stringify(pathsToPhotos),
    JSON.stringify([...pathsByWidths.values()])
  );

  await wait(2000);

  return {
    ids: ["file-320", "file-800", "file-1200", "file-1920", "file-3840"],
    urls: new Map([
      [320, "https://bla-bla.fler/image-320"],
      [800, "https://bla-bla.fler/image-800"],
      [1280, "https://bla-bla.fler/image-1200"],
      [1920, "https://bla-bla.fler/image-1920"],
      [3840, "https://bla-bla.fler/image-3840"],
    ]),
  };
};

export const removePhotos: PhotosWebStore["removePhotos"] = async (
  publicIds: string[]
) => {
  await wait(2000);

  console.log(
    "[FAKE REMOVE PHOTOS FROM CLOUDINARY]",
    JSON.stringify(publicIds)
  );

  return [];
};
