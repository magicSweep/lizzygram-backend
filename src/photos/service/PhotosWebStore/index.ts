import {
  init as initCloudinary,
  uploadMany,
  deleteMany,
} from "../../../cloudinary";
/* import {
  init as initCloudinary,
  uploadMany,
  deleteMany,
} from "../../../cloudinary/cloudinary.fake"; */
import {
  Width,
  Path,
  PhotoWebId,
  WebSecureUrl,
  WebImageInfo,
  WebImagesInfo,
} from "../../../types";

export const init = initCloudinary;

export const uploadPhotos = (pathsToPhotos: Path[]) =>
  uploadMany(pathsToPhotos);

export const makeWebImagesInfo = (
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

export const removePhotos = (publicIds: string[]) => {
  deleteMany(publicIds).catch((err) => {
    console.error(
      `Can't delete cloudinary photo file - ${publicIds} | ${err.message}`
    );
  });
};
