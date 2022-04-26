export { photosStorage as photosDiskStorageOptions } from "./diskStorage";

export { photoFileFilter } from "./fileFilter";

export const limits = {
  fields: 0,
  fieldSize: 1520,
  files: 1,
  fileSize: 20971520, //20971520 - 20MB
  headerPairs: 20,
};

/* export const downloadLimits = {
  fields: 1,
  fieldSize: 1520,
  files: 0,
  fileSize: 2971520, //20971520 - 20MB
  headerPairs: 20,
}; */

/* export const cleanUpLimits = {
  fields: 2,
  fieldSize: 1520,
  files: 0,
  fileSize: 2971520, //20971520 - 20MB
  headerPairs: 20,
}; */
