import { Done, NI_Next } from "fmagic";
import {
  Path,
  PhotoInfo,
  TransformedImageInfo,
  //WebImagesInfo,
  Width,
} from "../../../types";
import { WebImagesInfo } from "lizzygram-common-data/dist/types";

export type MainData = {
  reqInfo: {
    photoFile: Express.Multer.File;
  };
  photoInfo?: PhotoInfo;
  optimizedPhotosPaths?: Map<Width, Path>;
  webImagesInfo?: WebImagesInfo;
  error?: any;
  optimizedImageInfo?: TransformedImageInfo[];
  base64String?: string;
  googleDriveId?: string;
};

/// CONTROLLER
export type SavePhotoToOriginalPhotoStorage = (
  data: MainData
) => Promise<NI_Next<MainData> | Done>;

export type MakeOptimizedPhotosAndSaveToWeb = (
  data: MainData
) => Promise<NI_Next<MainData> | Done>;

export type MakePhotoInfo = (
  data: MainData
) => Promise<NI_Next<MainData> | Done>;

export type MakeBase64 = (data: MainData) => Promise<NI_Next<MainData> | Done>;
