import express, { Request, Response, NextFunction, json } from "express";
import { winstonLogger } from "./service/logger";
import dotenv from "dotenv";
import { getBuildFor } from "lizzygram-common-data";
import { join, resolve } from "path";
import multer, { DiskStorageOptions, Options } from "multer";
import {
  validateReqParams,
  validateMulterReqParams,
} from "./validateReqParams/index";
import {
  photoFileFilter,
  photosDiskStorageOptions,
  limits,
  mainMiddleware,
  cleanUpMiddleware,
  downloadPhotoMiddleware,
  downloadValidate,
} from "./photos";
import {
  //cleanupPhotoUrl,
  //downloadPhotoUrl,
  // mainPhotoUrl,
  pathToOptimizedPhotosDir,
  pathToUploadFilesDir,
} from "./config";
import { createReadStream, existsSync, mkdirSync } from "fs";
import { init as initFirestore } from "./service/firestore/firestore.fake";
import { init as initGoogleDrive } from "./service/googleDrive/googleDrive.fake";
import { init as initCloudinary } from "./service/cloudinary/cloudinary.fake";
import { roleMiddleware, tokenMiddleware, authMiddleware } from "./auth";

// PROTECT
//import cors from "cors";
//import helmet from "helmet";
//import rateLimit from "express-rate-limit";

export const init = async () => {
  // MAKE UPLOADS AND TEMP DIRS
  if (!existsSync(pathToUploadFilesDir)) {
    mkdirSync(pathToUploadFilesDir);
  }

  if (!existsSync(pathToOptimizedPhotosDir)) {
    mkdirSync(pathToOptimizedPhotosDir);
  }

  // SET ENV VARIABLES
  if (process.env.IENV === "local") {
    if (getBuildFor() === "lizzygram") {
      dotenv.config({ path: resolve(process.cwd(), ".env.lizzygram") });
    } else {
      dotenv.config({ path: resolve(process.cwd(), ".env.portfolio") });
    }
  }

  // CLOUDINARY
  initCloudinary();

  // GOOGLE DRIVE
  await initGoogleDrive(winstonLogger);

  // FIRESTORE
  initFirestore();

  // MULTER
  const uploadPhotoFile = multer({
    storage: multer.diskStorage(photosDiskStorageOptions),
    limits,
    fileFilter: photoFileFilter,
  }).single("file");

  const app = express();

  /* app.use(helmet());

  //TODO: add protection
  // CORS
  app.use(
    cors({
      origin: [
        "http://192.168.1.82:8080",
        "http://192.168.1.82:8000",
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "http://localhost:8000",
        "https://lizzygram.netlify.app",
        "https://photo-boom.vercel.app",
      ],
      methods: "POST,GET,OPTIONS",
    })
  );

  // RATE LIMIT
  const apiLimiter = rateLimit({
    windowMs: 1000 * 60 * 5, // 5 minutes
    max: 50,
    //message: "[ERROR 123567]",
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  }); 

  app.use(apiLimiter);*/

  app.use(json());

  app.get(
    "/",
    /* validateReqParams(winstonLogger, (body) => {
      winstonLogger.log("info", "VALIDATE REQUEST PARAMS", {
        DATA: body,
      });
      return true;
    }), */
    (req, res, next) => {
      res.status(200).send(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta http-equiv="X-UA-Compatible" content="IE=edge" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <a href="http://localhost:3009/download?name=hello" download>Download</a
          >
        </body>
      </html>
      `);
    }
  );

  // /main - post - "file"
  app.post(
    //mainPhotoUrl,
    "/main",
    tokenMiddleware("header", winstonLogger),
    authMiddleware(winstonLogger),
    roleMiddleware(winstonLogger),
    cleanUpMiddleware(winstonLogger),
    validateMulterReqParams(uploadPhotoFile, winstonLogger),
    mainMiddleware(winstonLogger)
  );

  // /cleanup - json - {webImagesInfo: {ids: string[], urls?}, googleDriveId}
  /*  app.delete(
    //cleanupPhotoUrl,
    "/cleanup",
    authorization(winstonLogger),
    validateReqParams(winstonLogger, cleanupValidate),
    cleanUpMiddleware(winstonLogger)
  ); */

  app.get(
    //downloadPhotoUrl /?token=""&id="" /:googleDriveId/:fileName
    "/download",
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        winstonLogger.log("info", `Download photo from Google drive | stream`, {
          INFO: {
            query: req.query,
            //headers: req.headers,
          },
        });

        //res.status(200).end();
        const photoStream = createReadStream(
          join(process.cwd(), "src/static/12.jpg")
        );

        res.setHeader(
          "Content-disposition",
          "attachment; filename=" + Date.now().toString() + ".jpg"
        );
        //res.type("application/octet-stream");
        //res.type("image/jpeg");
        //res.setHeader("Transfer-Encoding", "chunked");

        photoStream
          .on("data", (data_: any) => {
            res.write(data_);
          })
          .on("error", (err: any) => {
            //console.error("Error downloading file from Google drive.");
            winstonLogger.log(
              "error",
              `Download photo from Google drive | stream`,
              {
                INFO: {
                  ...req.params,
                  error: err,
                },
              }
            );
            res.status(500).end();
          })
          .on("end", () => {
            //console.log("Done downloading file from Google drive.");
            res.status(200).end();
          });
      } catch (err) {
        winstonLogger.log(
          "error",
          `Download photo from Google drive | get stream`,
          {
            INFO: {
              ...req.params,
              error: err,
            },
          }
        );
        res.status(500).end();
      }
    }
  );

  // /download - query params photoGoogleId, fileName /download/:googleDriveId/:fileName
  /* app.get(
    //downloadPhotoUrl /?t=""&id=""&n="" /:googleDriveId/:fileName
    "/download",
    tokenMiddleware("query", winstonLogger),
    authMiddleware(winstonLogger),
    roleMiddleware(winstonLogger),
    validateReqParams(winstonLogger, downloadValidate),
    downloadPhotoMiddleware(winstonLogger)
  ); */

  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    winstonLogger.log("error", "[GLOBAL_ERROR_HANDLER]", {
      METHOD: req.method,
      PATH: req.path,
      REQUEST_BODY: req.body,
      REQUEST_QUERY: req.query,
      ERROR: err,
    });

    /* const json: WorkerResponse = {
        status: "error",
      }; */

    // 401 - unauthorized
    // 400 - bad request
    // 201 - created
    // 500 - server error
    res.status(500).end();
  });

  return app;
};
