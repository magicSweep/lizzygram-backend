/* import {
  getOne,
  updateOne,
  deleteOne,
} from "../../../firestore/firestore.fake"; */
import { getOne, updateOne, deleteOne } from "../../../firestore";
//import { Photo, FirestoreDate, PhotoFieldsToUpdateOnAdd } from "../../../types";
import { Photo, FirestoreDate } from "lizzygram-common-data/dist/types";

import { photosCollectionName } from "../../../config";

export const getPhoto: (
  photoId: string
) => Promise<Photo<FirestoreDate> | undefined> = getOne(photosCollectionName);

export const updatePhoto: (
  photoId: string,
  fieldsToUpdate: any
) => Promise<boolean> = updateOne(photosCollectionName);

export const removePhoto: (photoId: string) => Promise<boolean> =
  deleteOne(photosCollectionName);
