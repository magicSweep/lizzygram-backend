import { compose, cond, elif, justReturn } from "fmagic";
//import { CleanUpRequestData } from "lizzygram-common-data/dist/types";
import {
  ValidateReqParams,
  ValidateReqParamsProps,
} from "../../../validateReqParams/types";

export type ValidateReqParamsData = ValidateReqParamsProps & {
  error?: string;
};

// reqParams - googleDirveId, fileName
export const cleanUpParamsValidate: ValidateReqParams = cond<
  ValidateReqParamsProps,
  boolean | string
>([
  [
    ({ reqBody }: ValidateReqParamsProps) =>
      reqBody === undefined ||
      reqBody.googleDriveId === undefined ||
      reqBody.webImagesInfo === undefined,
    () => "Bad request body...",
  ],
  [
    ({ reqBody }: ValidateReqParamsProps) =>
      typeof reqBody.googleDriveId !== "string",
    () => "googleDriveId must be string...",
  ],
  [
    ({ reqBody }: ValidateReqParamsProps) =>
      Array.isArray(reqBody.webImagesInfo.ids) !== true ||
      typeof reqBody.webImagesInfo.ids[0] !== "string",
    () => "webImagesInfo ids must be array of strings...",
  ],

  [() => true, () => true],
]);
/* elif(
    ({ reqParams, reqQuery }: ValidateReqParamsProps) =>
      reqParams === undefined ||
      reqParams.googleDriveId === undefined ||
      reqParams.fileName === undefined,
    (props: ValidateReqParamsProps) => ({
      ...props,
      error: "No googleDriveId or fileName",
    }),
    justReturn
  ), 
  elif<ValidateReqParamsData, boolean | string>(
    ({ error }: ValidateReqParamsData) => error !== undefined,
    (data: ValidateReqParamsData) => data.error as string,
    () => true
  )*/
