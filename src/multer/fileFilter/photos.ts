import { NI_Next, Done, compose, chain, fold, elif } from "fmagic";
import { Options } from "multer";
import {
  isValidPhotoFile,
  isValidPhotoID,
  isValidUserUid,
  isValidDate,
  isValidDesc,
  isValidTags,
} from "../../photos/service/Validator";
import {
  DateUTCString,
  JsonString,
  BuildFor,
} from "lizzygram-common-data/dist/types";
import { getBuildFor } from "lizzygram-common-data";

export type AddPhotoFileFilterData = {
  photoFile: Express.Multer.File;
  photoId: string;
  userUid: string;
};

export type EditPhotoFileFilterData = AddPhotoFileFilterData & {
  description?: string;
  date?: DateUTCString;
  //{ [name: string]: boolean }
  tags?: JsonString;
};

export const isValidAddPhotoReqParams = compose<
  AddPhotoFileFilterData,
  string | boolean
>(
  NI_Next.of,
  chain((data: AddPhotoFileFilterData) => {
    const validRes = isValidPhotoFile(data.photoFile);
    return typeof validRes === "string" ? Done.of(validRes) : NI_Next.of(data);
  }),
  chain((data: AddPhotoFileFilterData) => {
    const validRes = isValidPhotoID(data.photoId);
    return typeof validRes === "string" ? Done.of(validRes) : NI_Next.of(data);
  }),
  chain((data: AddPhotoFileFilterData) => {
    const validRes = isValidUserUid(data.userUid);
    return typeof validRes === "string" ? Done.of(validRes) : NI_Next.of(data);
  }),
  fold(
    (errMsg: string) => errMsg,
    () => true
  )
);

export const isValidEditPhotoReqParams_ = (buildFor: BuildFor) =>
  compose<EditPhotoFileFilterData, string | boolean>(
    NI_Next.of,
    chain((data: EditPhotoFileFilterData) => {
      const validRes = isValidAddPhotoReqParams(data);
      return typeof validRes === "string"
        ? Done.of(validRes)
        : NI_Next.of(data);
    }),
    chain(
      elif<EditPhotoFileFilterData, Done | NI_Next<EditPhotoFileFilterData>>(
        () => buildFor === "portfolio",
        //@ts-ignore
        (data: EditPhotoFileFilterData) => NI_Next.of(data),
        (data: EditPhotoFileFilterData) => {
          const validRes = isValidDate(data.date);
          return typeof validRes === "string"
            ? Done.of(validRes)
            : NI_Next.of(data);
        }
      )
    ),
    chain((data: EditPhotoFileFilterData) => {
      const validRes = isValidDesc(data.description);
      return typeof validRes === "string"
        ? Done.of(validRes)
        : NI_Next.of(data);
    }),
    chain((data: EditPhotoFileFilterData) => {
      const validRes = isValidTags(data.tags);
      return typeof validRes === "string"
        ? Done.of(validRes)
        : NI_Next.of(data);
    }),
    fold(
      (errMsg: string) => errMsg,
      () => true
    )
  );

export const isValidEditPhotoReqParams = isValidEditPhotoReqParams_(
  getBuildFor()
);

/* export const addPhotoFileFilter: Options["fileFilter"] = (req, file, cb) => {
  const { photoId, userUid } = req.body;

  const validRes = isValidAddPhotoReqParams({
    photoFile: file,
    photoId,
    userUid,
  });

  //console.log("FILE FILTER", photoId, userUid);

  if (typeof validRes === "string") {
    //console.log("FILE FILTER 33", validRes, photoId, userUid, file);
    return cb(new Error(validRes));
  }

  return cb(null, true);

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  // To reject this file pass `false`, like so:
  //cb(null, false);
  // To accept the file pass `true`, like so:
}; */

export const photoFileFilter: Options["fileFilter"] = (req, file, cb) => {
  //console.log("--------------------FILE FILTER", req.body);

  let validRes: string | boolean = "";

  if (req.body !== undefined) {
    const { photoId, userUid, date, tags, description } = req.body;

    validRes = isValidEditPhotoReqParams({
      photoFile: file,
      photoId,
      userUid,
      date,
      tags,
      description,
    });
  } else {
    validRes = "We have no request body";
  }

  if (typeof validRes === "string") {
    return cb(new Error(validRes));
  }

  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  // To reject this file pass `false`, like so:
  //cb(null, false);
  // To accept the file pass `true`, like so:
  return cb(null, true);
};
