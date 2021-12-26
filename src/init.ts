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
import { addPhotoMiddleware, editPhotoMiddleware } from "./photos";
import {
  pathToUploadFilesDir,
  pathToOptimizedPhotosDir,
  addPhotoUrl,
  editPhotoUrl,
  //wherokuPingUrl,
  downloadPhotoUrl,
} from "./config";
import { logMiddleware } from "./logger";
//import { downloadOriginalPhoto } from "./middleware/downloadOriginalPhoto";
import { existsSync, mkdirSync } from "fs";
// PROTECT
import cors from "cors";
//import helmet from "helmet";
//import rateLimit from "express-rate-limit";
/* import { init as initFirestore } from "./firestore/firestore.fake";
import { init as initGoogleDrive } from "./googleDrive/googleDrive.fake";
import { init as initCloudinary } from "./cloudinary/cloudinary.fake";
 */
import { init as initFirestore } from "./firestore";
import { init as initGoogleDrive } from "./googleDrive";
import { init as initCloudinary } from "./cloudinary";
import { WorkerResponse } from "./types";
import { join } from "path";

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
    dotenv.config({ path: resolve(process.cwd(), ".env") });
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
  await initGoogleDrive();

  // FIRESTORE
  initFirestore();

  const app = express();

  //TODO: add protection
  // CORS
  app.use(
    cors({
      origin: [
        "http://192.168.1.82:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "http://localhost:8000",
        "https://lizzygram.netlify.app",
      ],
      methods: "POST,OPTIONS",
    })
  );

  // LOGGER
  app.use(logMiddleware);

  // MAIN MIDDLEWAREs
  app.post(
    addPhotoUrl,
    //apiLimiter,
    multerMiddleware(upload),
    //upload.single("file"),
    addPhotoMiddleware
  );

  app.post(
    editPhotoUrl,
    //apiLimiter,
    //upload.single("file"),
    multerMiddleware(upload),
    editPhotoMiddleware
  );

  //TODO: add download original photo middleware
  // how to protect:
  // - check userUid
  // - send some cookie to check it request from site

  // GLOBAL_ERROR_HANDLER
  app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    let message = "";

    if (err.message) {
      message = `
          MESSAGE - ${err.message} 
          NAME - ${err.name}
          FILENAME - ${(err as any).filename}
          LINENUMBER - ${(err as any).lineNumber}
          STACK - ${err.stack}
        `;
    } else {
      message = JSON.stringify(err);
    }

    message = `
        REQUEST_PATH - ${req.path}
        REQUEST_BODY - ${req.body ? JSON.stringify(req.body) : "NO BODY"}
        ${message}
      `;

    console.log(`[GLOBAL_ERROR_HANDLER] ${message}`);

    const json: WorkerResponse = {
      status: "error",
      data: {
        error: message,
      },
    };

    res.status(200).json(json).end();
  });

  return app;
};
