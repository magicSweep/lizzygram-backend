import { compose, cond, elif } from "fmagic";
import {
  Photo,
  FirestoreDate,
  TagsData,
  DateUTCString,
  JsonString,
} from "../../../types";
import {
  regex,
  isLessThanMaxFileSizeMB,
  isValidFileFormat,
  hasTrueValue,
} from "./helper";
import {} from "multer";

export const isValidPhotoDbRecord = (
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
    (userUid: string) => regex(userUid, { pattern: /[a-zA-Z0-9]*/ }) === false,
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

export const isValidDate = cond<DateUTCString, boolean | string>([
  [(val: string) => val === undefined, (val: Date) => true],
  [
    (val: string) => new Date(val).toString() === "Invalid Date",
    (val: string) => {
      return `Некорректная дата | ${val}`;
    },
  ],
  [
    (val: string) => new Date(val) > new Date(),
    (val: string) => {
      return `Фотка сделана в будущем? | ${val}`;
    },
  ],
  [
    (val: string) => new Date(val) < new Date("2018-07-08"),
    (val: string) => {
      return `До дня рождения? | ${val}`;
    },
  ],
  [() => true, () => true],
]);

export const isValidPhotoFile = (file: Express.Multer.File) => {
  if (file === undefined) return `We've got no photo file`;

  if (
    file === null ||
    typeof file !== "object" ||
    file.mimetype === undefined
    // || file.size === undefined
  )
    return `Wrong file - ${JSON.stringify(file)}`;

  /* 
  // FILE SIZE WE CHECK WITH MULTER LIMITS 
  if (isLessThanMaxFileSizeMB(21, file.size) === false) {
    return `Максимальный размер файла 21 Mb. | ${file.size}`;
  } */

  if (isValidFileFormat(["jpeg", "png", "jpg"], file.mimetype) === false) {
    return `Файл должен быть типа: jpeg, png, jpg | ${file.mimetype}`;
  }

  return true;
};

export const isValidDesc = (val: string | undefined) => {
  //console.log("VALIDATE", val);
  if (val !== undefined && val.length > 1200) return "Слишком длинно...";
  return true;
};

/* export const isValidTags = cond([
  [(tags: TagsData) => tags === undefined, () => true],
  [
    (tags: TagsData) => typeof tags === "object",
    (tags: TagsData) =>
      hasTrueValue(tags) === true
        ? true
        : `Добавьте хотя бы один тэг. | ${JSON.stringify(tags)}`,
  ],
  [() => true, (tags: TagsData) => `Wrong tags | ${JSON.stringify(tags)}`],
]); */

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

    cond([
      [
        (tags: TagsData) => tags === null || typeof tags !== "object",
        (tags: TagsData) => `Wrong tags | ${JSON.stringify(tags)}`,
      ],
      [
        (tags: TagsData) => true,
        (tags: TagsData) =>
          hasTrueValue(tags) === true
            ? true
            : `Добавьте хотя бы один тэг. | ${JSON.stringify(tags)}`,
      ],
    ])
  )
);

/* compose<TagsData, boolean | string>(
  elif(
    (tags?: TagsData) => typeof tags === "object",
    hasTrueValue,
    () => false
  ),
  (isTap: boolean) => isTap || "Добавьте хотя бы один тэг."
); */
