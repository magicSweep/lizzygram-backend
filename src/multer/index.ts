export { photosStorage as photosDiskStorageOptions } from "./diskStorage/photos";

export { photoFileFilter } from "./fileFilter/photos";

export const limits = {
  fields: 6,
  fieldSize: 10520,
  files: 1,
  fileSize: 20971520, //20971520 - 20MB
  headerPairs: 20,
};

export { multerMiddleware } from "./middleware";
