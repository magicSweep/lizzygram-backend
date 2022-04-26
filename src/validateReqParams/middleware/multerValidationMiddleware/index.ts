import multer from "multer";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { Logger } from "winston";
import { chain, compose, cond, Done, elif, fold, NI_Next } from "fmagic";
import { ValidateReqParams } from "../../types";

// All req params check we make here
// If some param do not valid or not exist we response with bad request
/* const multerMiddleware =
  (
    upload: RequestHandler,
    logger: Logger,
    reqBodyValidate?: (body: any) => boolean
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    upload(req, res, function (err) {
      if (err !== undefined) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          logger.log("info", "MULTER VALIDATION FAILED", { error: err });
        } else if (err) {
          // An unknown error occurred when uploading.
          //console.log("Not MULTER ERROR", err.toString());
          logger.log("error", "-Not MULTER ERROR", { error: err });
        }

        return res.status(400).end();
      }

      // IF WE HAVE NO FILE MULTER DO NOT START FILE FILTER
      // If we got no file multer think that it is okey
      if (req.file === undefined) {
        if (reqBodyValidate !== undefined) {
          if (reqBodyValidate(req.body) === false) {
            logger.log("info", "VALIDATION REQUEST PARAMS FAILED", {
              error: err,
            });
          }
        }
      }

      logger.log("info", "MULTER VALIDATION SUCCESS", {
        body: req.body,
        file: req.file,
      });

      next();
      // Everything went fine.
    }); */

type UploadFuncData = {
  error?: any;
  msgLevel: string;
  logMsg: string;
};

const multerMiddleware =
  (
    upload: RequestHandler,
    logger: Logger,
    isFileRequired: boolean = true,
    reqBodyValidate?: ValidateReqParams
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    upload(
      req,
      res,
      uploadCallback(req, res, next, logger, isFileRequired, reqBodyValidate)
    );

export const uploadCallback = (
  req: Request,
  res: Response,
  next: NextFunction,
  logger: Logger,
  isFileRequired: boolean,
  reqBodyValidate?: ValidateReqParams
) =>
  compose<any, NextFunction>(
    (err: any) => NI_Next.of({ error: err }),
    chain(
      cond([
        [
          ({ error }: UploadFuncData) => error !== undefined,
          elif<UploadFuncData, any>(
            (data: UploadFuncData) => data.error instanceof multer.MulterError,
            (data: UploadFuncData) =>
              Done.of({
                ...data,
                msgLevel: "info",
                logMsg: "MULTER VALIDATION FAILED",
              }),
            (data: UploadFuncData) =>
              Done.of({
                ...data,
                msgLevel: "error",
                logMsg: "-NOT MULTER ERROR",
              })
          ),
        ],
        [
          () => isFileRequired === true && req.file === undefined,
          (data: UploadFuncData) =>
            Done.of({
              ...data,
              msgLevel: "error",
              logMsg: "NO FILE ON REQUEST OBJECT",
            }),
        ],
        [
          () =>
            reqBodyValidate !== undefined &&
            reqBodyValidate({
              reqBody: req.body,
              reqParams: req.params,
            }) !== true,
          (data: UploadFuncData) =>
            Done.of({
              ...data,
              // TODO change that bad design
              error: (reqBodyValidate as any)({
                reqBody: req.body,
                reqParams: req.params,
              }),
              msgLevel: "info",
              logMsg: "VALIDATION REQUEST PARAMS FAILED",
            }),
        ],
        [() => true, NI_Next.of],
      ])
    ),
    fold(
      ({ msgLevel, logMsg, error }: UploadFuncData) => {
        logger.log(msgLevel, logMsg, { error });

        res.status(400).end();
      },
      () => {
        logger.log("info", "MULTER VALIDATION SUCCESS", {
          body: req.body,
          file: req.file,
        });

        next();
      }
    )
  );

export default multerMiddleware;
