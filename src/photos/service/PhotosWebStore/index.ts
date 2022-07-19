import {
  init as initCloudinary,
  uploadMany,
  deleteMany,
} from "magic-data/cloudinary";

import {
  Width,
  Path,
  PhotoWebId,
  WebSecureUrl,
  WebImageInfo,
} from "../../../types";
import { PhotosWebStore } from "./types";
import { WebImagesInfo } from "lizzygram-common-data/dist/types";

export const init: PhotosWebStore["init"] = initCloudinary;

const makeWebImagesInfo = (
  imagesInfo: WebImageInfo[],
  pathsByWidths: Map<Width, Path>
): WebImagesInfo => {
  const infoDiffWidths = new Map<number, WebImageInfo>();

  let i = 0;
  //@ts-ignore
  for (let width of pathsByWidths.keys()) {
    infoDiffWidths.set(width, imagesInfo[i]);
    i++;
  }

  const ids: PhotoWebId[] = [];
  const urls = new Map<Width, WebSecureUrl>();

  for (let [width, photoInfo] of infoDiffWidths) {
    ids.push(photoInfo.id);
    urls.set(width, photoInfo.url);
  }

  return { ids, urls };
};

export const uploadPhotos: PhotosWebStore["uploadPhotos"] = async (
  pathsToPhotos: Path[],
  pathsByWidths: Map<Width, Path>
) => {
  const webImagesInfo = await uploadMany(pathsToPhotos);

  console.log("UPLOAD PHOTOS", webImagesInfo);

  return makeWebImagesInfo(webImagesInfo, pathsByWidths);
};

export const removePhotos: PhotosWebStore["removePhotos"] = deleteMany;
