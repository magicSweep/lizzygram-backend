import {
  getExpirationDateFromFirestore_,
  //getExpirationDateFromFs,
  saveNewExpirationDateToFirestore_,
  //saveNewExpirationDateToFs,
  sendRequestToCleanupService,
  calcNewExpirationDate,
  //(data.expirationDateFromFirestore as Date) < expirationData
  isDateExpired,
} from "./cleanup.helper";
import { getOne, updateOne } from "../../../service/firestore";
import { onCleanup_, getExpirationDate, setExpirationDate } from "./cleanup";
//import { existsSync } from "fs";
import { Logger } from "winston";
import { Request, Response, NextFunction } from "express";

const getExpirationDateFromFirestore = getExpirationDateFromFirestore_(getOne);
const saveNewExpirationDateToFirestore =
  saveNewExpirationDateToFirestore_(updateOne);

const onCleanup = onCleanup_(
  getExpirationDate,
  setExpirationDate,
  getExpirationDateFromFirestore,
  //getExpirationDateFromFs,
  saveNewExpirationDateToFirestore,
  // saveNewExpirationDateToFs,
  sendRequestToCleanupService,
  calcNewExpirationDate,
  isDateExpired
  //existsSync
);

export const cleanUpMiddleware =
  (logger: Logger) => (req: Request, res: Response, next: NextFunction) => {
    onCleanup(logger);

    next();
  };
