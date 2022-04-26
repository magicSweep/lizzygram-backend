import { Options } from "multer";
import { isValidPhotoFile } from "../../service/Validator";

export const photoFileFilter: Options["fileFilter"] = (req, file, cb) => {
  //console.log("--------------------FILE FILTER", req.body);

  let validRes: string | boolean = "";

  validRes = isValidPhotoFile(file);

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
