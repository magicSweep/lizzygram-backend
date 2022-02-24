import { compose, set, elif, justReturn } from "fmagic";
import { photoSizes } from "../../config";
import {
  AddPhotoData,
  EditPhotoData,
  WebSecureUrl,
  Width,
  PhotoFieldsToUpdateOnAdd,
  PhotoFieldsToUpdateOnEdit,
} from "../../types";
import { getYearsOld } from "../../utils/app";

export const getSrcSet = (webUrls: Map<Width, WebSecureUrl>) => {
  let result = "";

  //"/images/girl_300.jpeg 300w, /images/girl_600.jpeg 600w"

  //@ts-ignore
  for (let webUrl of webUrls) {
    switch (webUrl[0]) {
      case 320:
        //result += `${urlByWidth[1]} 400w, `;
        break;
      case 800:
        result += `${webUrl[1]} 600w, `;
        break;
      case 1280:
        result += `${webUrl[1]} 1000w, `;
        break;
      case 1920:
        result += `${webUrl[1]} 1500w, `;
        break;
      case 3840:
        result += `${webUrl[1]} 2300w`;
        break;

      default:
        throw new Error(
          `No implementation for width = ${webUrl[0]} in getSrcSet`
        );
    }
  }

  return result;
};

const getSrc_ = (photoSizes: any) => (urls: Map<number, string>) => {
  return urls.get(photoSizes[1].width);
};

const getIconSrc_ = (photoSizes: any) => (urls: Map<number, string>) => {
  return urls.get(photoSizes[0].width);
};

const getIconSrc = getIconSrc_(photoSizes);

const getSrc = getSrc_(photoSizes);

export const makePhotoFieldsToUpdateOnAdd = (data: AddPhotoData) =>
  compose<unknown, PhotoFieldsToUpdateOnAdd>(
    () => ({}),
    set("base64", data.base64String),
    set("files", data.webImagesInfo?.ids),
    set("aspectRatio", data.photoInfo?.aspectRatio),
    set("imageExtention", data.photoInfo?.imageExtention),

    set("src", getSrc(data.webImagesInfo?.urls as Map<number, string>)),
    set("iconSrc", getIconSrc(data.webImagesInfo?.urls as Map<number, string>)),
    set("srcSet", getSrcSet(data.webImagesInfo?.urls as Map<number, string>)),

    set("isActive", true)
  )();

export const makePhotoFieldsToUpdateOnEdit = (data: EditPhotoData) =>
  compose<unknown, PhotoFieldsToUpdateOnEdit>(
    () => makePhotoFieldsToUpdateOnAdd(data),
    elif(
      () => data.reqInfo.description !== undefined,
      set("description", data.reqInfo.description),
      justReturn
    ),
    elif(
      () => data.reqInfo.tags !== undefined,
      set("tags", () => JSON.parse(data.reqInfo.tags as string)),
      justReturn
    ),
    elif(
      () => data.reqInfo.date !== undefined,
      set("date", () => new Date(data.reqInfo.date as string)),
      justReturn
    ),
    elif(
      (obj: PhotoFieldsToUpdateOnEdit | undefined) => obj?.date !== undefined,
      set("yearsOld", (self: PhotoFieldsToUpdateOnEdit) =>
        getYearsOld(self.date as Date)
      ),
      justReturn
    )
  )();
