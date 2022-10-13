/* import {
  getExpirationDateFromFirestore_,
  //getExpirationDateFromFs,
  saveNewExpirationDateToFirestore_,
  //saveNewExpirationDateToFs,
  sendRequestToCleanupService,
  calcNewExpirationDate,
  //(data.expirationDateFromFirestore as Date) < expirationData
  isDateExpired,
} from "./cleanup.helper";
import { getOne, updateOne } from "magic-data/firestore";
import { onCleanup_ } from "./cleanup"; */
//import { existsSync } from "fs";
import { Logger } from "winston";
import { Request, Response, NextFunction } from "express";
import { storagesCleanUp } from "../../controller/CleanUp";

export const cleanUpMiddleware =
  (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
    storagesCleanUp(logger)(req.body);

    res.status(200).end();
  };

export { cleanUpParamsValidate } from "./cleanUp.validate";
