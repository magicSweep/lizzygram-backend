import { Photo, WebImagesInfo } from "lizzygram-common-data/dist/types";
import { Logger } from "winston";
import { MainData } from "../../middleware/Main/types";

export type CleanUp = (logger: Logger) => (data: MainData) => void;

export type FullCleanUp = (logger: Logger) => (data: MainData) => void;

export type StoragesCleanUp = (
  logger: Logger
) => (data: CleanUpReqData) => void;

export type CleanUpReqData = {
  webImagesInfo: WebImagesInfo;
  googleDriveId: Photo<any>["googleDriveId"];
};
