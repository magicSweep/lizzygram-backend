import { NextFunction, Request, Response } from "express";
import {
  compose,
  NI_Next,
  Done,
  chain,
  then,
  _catch,
  fold,
  map,
  tap,
  elif,
  Next,
  thenDoneFold,
  cond,
  justReturn,
} from "fmagic";
import { Logger } from "winston";
import { downloadImageStream as downloadImageStream_ } from "../../../googleDrive";
import { isValidPhotoQuery as isValidPhotoQuery_ } from "../../service/Validator";

type DownloadPhotoMiddlewareData = {
  photoQuery: string;
  //splittedPhotoQuery: string[];
  userUid: string;
  googleDriveId: string;
  //extension: string;
  resultDebug: string;
  validation: string | true;
  userExists: boolean;
  fileName: string;
};

export const downloadPhotoMiddleware_ =
  (
    isValidPhotoQuery: typeof isValidPhotoQuery_,
    userExists: (userUid: string) => Promise<boolean>,
    downloadImageStream: typeof downloadImageStream_
  ) =>
  (logger: Logger) =>
  (req: Request, res: Response, next: NextFunction) =>
    compose(
      // get photo query from request /12weqw23rew.jpeg
      () => ({
        photoQuery: req.params.photoQuery,
        fileName: req.params.fileName,
      }),
      /*  (photoQuery: string) => ({
        photoQuery,
        splittedPhotoQuery: photoQuery.split("."),
      }), */

      // validate
      cond([
        /*  [
          (data: DownloadPhotoMiddlewareData) =>
            data.splittedPhotoQuery.length !== 2,
          (data: DownloadPhotoMiddlewareData) =>
            Done.of({
              ...data,
              resultDebug: `We got wrong photo query format...`,
            }),
        ], */
        [
          (data: DownloadPhotoMiddlewareData) => {
            data.validation = isValidPhotoQuery(data.photoQuery) as
              | string
              | true;
            return data.validation !== true;
          },
          (data: DownloadPhotoMiddlewareData) =>
            Done.of({
              ...data,
              resultDebug: `Validation not pass...`,
            }),
        ],
        [() => true, Next.of],
      ]),

      //http://localhost:3009/download/kMwibQErO6dDH6gf3entRLqFBop21mrIb1q3nD3QGWl0kf97vcVdJ0gm5S6qe/photo_85490.jpeg
      // parse photo query | query = userUid(28) + googleDriveId(33)
      map((data: DownloadPhotoMiddlewareData) => ({
        ...data,
        userUid: data.photoQuery.substring(0, 28),
        googleDriveId: data.photoQuery.substring(28),
        //extension: data.splittedPhotoQuery[1],
      })),

      // check users grants
      chain(
        compose(
          async (data: DownloadPhotoMiddlewareData) => ({
            ...data,
            userExists: await userExists(data.userUid),
          }),
          then((data: DownloadPhotoMiddlewareData) =>
            data.userExists === true
              ? NI_Next.of(data)
              : Done.of({
                  ...data,
                  resultDebug: "User does not have grants to download photo...",
                })
          ),
          _catch((err: any) =>
            Done.of({ resultDebug: "Error on user check...", error: err })
          )
        )
      ),

      thenDoneFold(
        (data: DownloadPhotoMiddlewareData) => {
          //console.log("DONE--", data, logger, res);
          // log error
          logger.log("error", `DOWNLOAD PHOTO ERROR`, {
            INFO: data,
          });
          // send response
          return res
            .status(400)
            .json({
              status: "error",
              data: {},
            })
            .end();
        },
        async (data: DownloadPhotoMiddlewareData) => {
          //console.log("NEXT--", data);

          const photoStream = await downloadImageStream(data.googleDriveId);

          res.setHeader(
            "Content-disposition",
            "attachment; filename=" + data.fileName
          );
          //res.type("application/octet-stream");
          //res.type("image/jpeg");
          //res.setHeader("Transfer-Encoding", "chunked");

          photoStream
            .on("data", (data_) => {
              res.write(data_);
            })
            .on("error", (err) => {
              //console.error("Error downloading file from Google drive.");
              logger.log("error", `Download photo from Google drive`, {
                INFO: {
                  ...data,
                  error: err,
                },
              });
              res.end();
            })
            .on("end", () => {
              //console.log("Done downloading file from Google drive.");
              res.end();
            });
        }
      )

      //(data: DownloadPhotoMiddlewareData) => {}
      // send request to firestore, to check user
      // download photo
    )();
