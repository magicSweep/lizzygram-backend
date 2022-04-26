import { OriginalPhotoInfo, Path } from "../../../types";

export type OriginalPhotoStore = {
  init: () => Promise<boolean>;

  isExists: (photoId: string) => Promise<boolean>;

  save: (
    photoFileName: string,
    pathToPhoto: Path
  ) => Promise<OriginalPhotoInfo>;

  update: (
    googleDriveId: string,
    pathToPhoto: Path
  ) => Promise<OriginalPhotoInfo>;

  download: (fileId: string, destPath: Path) => Promise<boolean>;

  remove: (fileId: string) => Promise<any>;
};
