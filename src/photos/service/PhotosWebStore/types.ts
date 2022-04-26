import { Path, WebImageInfo, Width } from "../../../types";
import { WebImagesInfo } from "lizzygram-common-data/dist/types";

export type PhotosWebStore = {
  init: () => void;

  uploadPhotos: (
    pathsToPhotos: Path[],
    pathsByWidths: Map<Width, Path>
  ) => Promise<WebImagesInfo>;

  /*  makeWebImagesInfo: (
      imagesInfo: WebImageInfo[],
      pathsByWidths: Map<Width, Path>
    ) => WebImagesInfo; */

  removePhotos: (publicIds: string[]) => Promise<any[]>;
};
