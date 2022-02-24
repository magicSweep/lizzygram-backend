import multer from "multer";
import { RequestHandler, Request, Response, NextFunction } from "express";
import { Logger } from "winston";

export const multerMiddleware =
  (upload: RequestHandler, logger: Logger) =>
  (req: Request, res: Response, next: NextFunction) =>
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        logger.log("error", "MULTER ERROR", { err });
        return next(`[MULTER ERROR] | ${err.message}`);
      } else if (err) {
        // An unknown error occurred when uploading.
        //console.log("Not MULTER ERROR", err.toString());
        logger.log("error", "-Not MULTER ERROR", { err });
        return next(err.toString());
      }

      logger.log("info", "MULTER UPLOAD", {
        body: req.body,
        file: req.file,
      });

      next();
      // Everything went fine.
    });
