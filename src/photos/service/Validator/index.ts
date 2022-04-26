import { compose, cond, elif } from "fmagic";
import { DateUTCString, JsonString } from "lizzygram-common-data/dist/types";
/* import {
  Photo,
  FirestoreDate,
} from "lizzygram-common-data/dist/types"; */
import { Photo, FirestoreDate } from "lizzygram-common-data/dist/types";

import {
  regex,
  isLessThanMaxFileSizeMB,
  isValidFileFormat,
  hasTrueValue,
} from "./helper";
import {
  isValidPhotoFileBackend,
  isValidDesc as isValidDesc_,
  isValidDate as isValidDate_,
  isValidTags as isValidTags_,
} from "lizzygram-common-data";
//import {} from "multer";

export const isValidPhotoFile = isValidPhotoFileBackend;

export const isValidGoogleDriveId = (id: string) => {
  if (typeof id !== "string") return "Google drive id must be string";

  if (id.length !== 33) return "Google drive id must contain 33 symbols";

  return true;
};

/* export const isValidPhotoDbRecord = (
  photoId: string,
  photo: Photo<FirestoreDate> | undefined,
  userUid: string
) => {
  // request to firestore by this.photoId
  if (photo === undefined) {
    return `No photo record in Firestore on add with id ${photoId} | userUid - ${userUid}`;
  }

  if (photo.addedByUserUID !== userUid) {
    return `Users uid does not match - ${userUid} | ${JSON.stringify(photo)}`;
  }

  return true;
};

export const isValidPhotoDbRecordOnAdd = (
  photoId: string,
  photo: Photo<FirestoreDate> | undefined,
  userUid: string
) => {
  const valid = isValidPhotoDbRecord(photoId, photo, userUid);

  if (typeof valid === "string") return valid;

  if ((photo as Photo<FirestoreDate>).isActive !== false) {
    return `Photo to add is activated - ${JSON.stringify(
      (photo as Photo<FirestoreDate>).id
    )} | ${userUid}`;
  }

  return true;
};

export const isValidPhotoDbRecordOnEdit = (
  photoId: string,
  photo: Photo<FirestoreDate> | undefined,
  userUid: string
) => {
  const isValid = isValidPhotoDbRecord(photoId, photo, userUid);

  if (typeof isValid === "string") return isValid;

  if ((photo as Photo<FirestoreDate>).isActive !== true) {
    return `Photo to edit is not activated - ${JSON.stringify(
      (photo as Photo<FirestoreDate>).id
    )} | ${userUid}`;
  }

  return true;
};

// parse photo query | query = userUid(28) + googleDriveId(33)
export const isValidPhotoQuery = cond<string, string | true>([
  [
    (photoQuery: string) => typeof photoQuery !== "string",
    (photoQuery: string) => {
      return `photoQuery must be  string | ${JSON.stringify(photoQuery)}`;
    },
  ],
  [
    (photoQuery: string) => photoQuery.length !== 61,
    (photoQuery: string) => {
      return `photoQuery must contain 61 symbol...${
        photoQuery.length > 65 ? photoQuery.substring(0, 64) : photoQuery
      }`;
    },
  ],
  [
    (photoQuery: string) =>
      regex(photoQuery, { pattern: /[a-zA-Z0-9-_]/ }) === false,
    (photoQuery: string) => {
      return `Bad symbols in photoQuery... | ${JSON.stringify(photoQuery)}`;
    },
  ],
  [() => true, () => true],
]);

export const isValidUserUid = cond<string | undefined, string | boolean>([
  [
    (userUid: string) => typeof userUid !== "string",
    (userUid: string) => {
      return `UserUid must be  string | ${JSON.stringify(userUid)}`;
    },
  ],
  [
    (userUid: string) => userUid.length > 124,
    (userUid: string) => {
      return `Too long userUid...${userUid.substring(0, 124)}`;
    },
  ],
  [
    (userUid: string) => regex(userUid, { pattern: /[a-zA-Z0-9]/ }) === false,
    (userUid: string) => {
      return `Bad symbols in userUid... | ${JSON.stringify(userUid)}`;
    },
  ],
  [() => true, () => true],
]);

export const isValidPhotoID = (photoId: string) => {
  if (photoId === undefined) return "We have no photoId";

  if (typeof photoId !== "string") {
    return `Photo id must be  string | ${JSON.stringify(photoId)}`;
  }

  const id = parseInt(photoId);

  // TODO: remove support 13 length
  if (
    typeof id !== "number" ||
    !(id.toString().length === 14 || id.toString().length === 13)
  ) {
    return `Wrong photo id... | ${JSON.stringify(photoId)}`;
  }

  return true;
};

export const isValidDate = (date: DateUTCString | undefined) => {
  if (date === undefined) return true;

  return isValidDate_(date);
};

export const isValidDesc = (val: string | undefined) => {
  //console.log("VALIDATE", val);
  //if (val !== undefined && val.length > 1200) return "Слишком длинно...";

  if (val === undefined) return true;

  return isValidDesc_(val);
};

export const isValidTags = elif(
  (tags?: JsonString) => tags === undefined,
  () => true,
  compose(
    (tags: JsonString) => {
      try {
        return JSON.parse(tags);
      } catch (err) {
        //console.error("Can not parse tags", JSON.stringify(tags));
        return null;
      }
    },

    isValidTags_
  )
);
 */
