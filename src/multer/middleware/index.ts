import multer from "multer";
import { RequestHandler, Request, Response, NextFunction } from "express";

export const multerMiddleware =
  (upload: RequestHandler) =>
  (req: Request, res: Response, next: NextFunction) =>
    upload(req, res, function (err) {
      if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading.
        //console.log("MULTER ERROR", err);
        return next(`[MULTER ERROR] | ${err.message}`);
      } else if (err) {
        // An unknown error occurred when uploading.
        //console.log("Not MULTER ERROR", err.toString());
        //console.log("-Not MULTER ERROR", typeof err);
        return next(err.toString());
      }

      //console.log("MULTER UPLOAD", req.body, req.file);

      next();
      // Everything went fine.
    });
