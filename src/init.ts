import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { resolve } from "path";
import multer from "multer";
import {
  photoFileFilter,
  photosDiskStorageOptions,
  limits,
  multerMiddleware,
} from "./multer";
import {
  addPhotoMiddleware,
  editPhotoMiddleware,
  performanceMiddleware,
  downloadPhotoMiddleware,
} from "./photos";
import {
  pathToUploadFilesDir,
  pathToOptimizedPhotosDir,
  addPhotoUrl,
  editPhotoUrl,
  //wherokuPingUrl,
  downloadPhotoUrl,
} from "./config";
import { requestLog as requestLogMiddleware } from "./middleware/requestLog";
import { errorHandler as globalErrorHandlerMiddleware } from "./middleware/globalErrorHandler";
//import { downloadOriginalPhoto } from "./middleware/downloadOriginalPhoto";
import { existsSync, mkdirSync } from "fs";
// PROTECT
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
/* import { init as initFirestore } from "./firestore/firestore.fake";
import { init as initGoogleDrive } from "./googleDrive/googleDrive.fake";
import { init as initCloudinary } from "./cloudinary/cloudinary.fake";
 */
import { init as initFirestore } from "./firestore";
import { init as initGoogleDrive } from "./googleDrive";
import { init as initCloudinary } from "./cloudinary";
//import { WorkerResponse } from "lizzygram-common-data/dist/types";
import { winstonLogger } from "./logger";
import { getBuildFor } from "lizzygram-common-data";

// web: pm2 start ./dist/src/index.js -i 1 --max-memory-restart 490M
export const init = async () => {
  console.log("START_INIT");

  // MAKE UPLOADS AND TEMP DIRS
  if (!existsSync(pathToUploadFilesDir)) {
    mkdirSync(pathToUploadFilesDir);
  }

  if (!existsSync(pathToOptimizedPhotosDir)) {
    mkdirSync(pathToOptimizedPhotosDir);
  }

  // SET ENV VARIABLES
  console.log("INIT", getBuildFor());
  console.log("ENV", process.env.NODE_ENV);

  if (process.env.IENV === "local") {
    if (getBuildFor() === "lizzygram") {
      dotenv.config({ path: resolve(process.cwd(), ".env.lizzygram") });
    } else {
      dotenv.config({ path: resolve(process.cwd(), ".env.portfolio") });
    }
  }

  // MULTER
  const upload = multer({
    storage: multer.diskStorage(photosDiskStorageOptions),
    limits,
    fileFilter: photoFileFilter,
  }).single("file");

  // CLOUDINARY
  initCloudinary();

  // GOOGLE DRIVE
  await initGoogleDrive(winstonLogger);

  // FIRESTORE
  initFirestore();

  const app = express();

  app.use(helmet());

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

  // LOG REQUEST
  app.use(requestLogMiddleware(winstonLogger));

  /* app.get("/", (req, res, next) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="/app.js"></script>
          <link rel="stylesheet" href="/styles.css">
          <title>My server</title>
      </head>
      <body>
          <h1>My server</h1>
          <a download="hello.png" href="/download/kMwibQErO6dDH6gf3entRLqFBop21JpdtwHEsOnaYI9TEFID4qtIErE3vV_vs">Download file</a>
      </body>
      </html>
    `);
  }); */

  // Photos MIDDLEWAREs
  app.post(
    `/${addPhotoUrl}`,
    apiLimiter,
    multerMiddleware(upload, winstonLogger),
    //upload.single("file"),
    addPhotoMiddleware(winstonLogger)
  );

  app.post(
    `/${editPhotoUrl}`,
    apiLimiter,
    //upload.single("file"),
    multerMiddleware(upload, winstonLogger),
    editPhotoMiddleware(winstonLogger)
  );

  app.get(
    downloadPhotoUrl,
    apiLimiter,
    //upload.single("file"),
    //multerMiddleware(upload),
    downloadPhotoMiddleware(winstonLogger)
  );

  /* app.post(
    "/photo-performance",
    //apiLimiter,
    //upload.single("file"),
    multerMiddleware(upload),
    performanceMiddleware(winstonLogger)
  ); */

  //TODO: add download original photo middleware
  // how to protect:
  // - check userUid
  // - send some cookie to check it request from site

  // GLOBAL_ERROR_HANDLER
  app.use(globalErrorHandlerMiddleware(winstonLogger));

  return app;
};
