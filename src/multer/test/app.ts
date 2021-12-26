import express, { Request, Response, NextFunction, Express } from "express";
import multer, { Options } from "multer";
import { join } from "path";
//import { fileFilter, fileName, multerMiddleware } from "../multer";
import request from "supertest";
import { multerMiddleware } from "./../middleware";

const multerLimits = {
  fields: 6,
  fieldSize: 10520,
  files: 1,
  fileSize: 20971520, //20971520 - 20MB
  headerPairs: 20,
};

const pathToPhoto = join(process.cwd(), "src/static/12.jpg");
const pathToWrongFile = join(process.cwd(), "src/types.ts");
const url = "/test-multer";

export const init = async (
  multerLimits: Options["limits"],
  fileFilter: Options["fileFilter"]
) => {
  // MULTER
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, join(process.cwd(), "src/multer/uploads"));
    },
    filename: function (req, file, cb) {
      const fileExtension = file.mimetype.split("/")[1];
      const uniqueSuffix = `${Date.now()}-${Math.round(
        Math.random() * 1e9
      )}.${fileExtension}`;
      cb(null, `photo-${uniqueSuffix}`);
    },
  });

  const upload = multer({
    storage,
    limits: multerLimits,
    fileFilter,
  }).single("file");

  const app = express();

  app.post(
    url,
    /* (req, res, next) => {
      upload(req, res, function (err) {
        if (err instanceof multer.MulterError) {
          // A Multer error occurred when uploading.
          //console.log("MULTER ERROR");
          next(`[MULTER ERROR] | ${err.message}`);
        } else if (err) {
          // An unknown error occurred when uploading.
          //console.log("SOME ERROR");
          next(err);
        }
        //console.log("MULTER");
        // Everything went fine.
        next();
      });
    }, */

    multerMiddleware(upload),

    async (req: Request, res: Response, next: NextFunction) => {
      console.log("------------------AFTER MULTER", req.file, req.file?.path);

      const json = {
        status: "success",
        data: req.body,
        file: req.file,
      };

      res.status(200).json(json).end();
    }
  );

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const json = {
      status: "error",
      error: err,
      body: req.body,
      file: req.file,
    };

    res.status(200).json(json).end();
  });

  return app;
};
