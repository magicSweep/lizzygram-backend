/* import {
  getOne,
  updateOne,
  deleteOne,
} from "../../../firestore/firestore.fake"; */
import { exists as exists_ } from "../../../firestore";
//import { Photo, FirestoreDate, PhotoFieldsToUpdateOnAdd } from "../../../types";
import { Photo, FirestoreDate } from "lizzygram-common-data/dist/types";

import { usersCollectionName } from "../../../config";

export const exists: (userUid: string) => Promise<boolean> =
  exists_(usersCollectionName);
