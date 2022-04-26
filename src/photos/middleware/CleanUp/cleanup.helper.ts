import { readFile, writeFile } from "fs/promises";
//import { getOne, updateOne } from "../../../service/firestore";
import * as Service from "./types";

export const getExpirationDateFromFirestore_: (
  getOne: (collectionName: string) => (docId: string) => Promise<any>
) => Service.GetExpirationDateFromFirestore =
  (getOne) => async (collectionName: string, docId: string) => {
    const data = await getOne(collectionName)(docId);

    return data.date.toDate();
  };

export const saveNewExpirationDateToFirestore_: (
  updateOne: (
    collectionName: string
  ) => (docId: string, fieldsToUpdate: any) => Promise<any>
) => Service.SaveNewExpirationDateToFirestore =
  (updateOne) =>
  async (collectionName: string, docId: string, newDate: Date) => {
    return updateOne(collectionName)(docId, { date: newDate });
  };

export const getExpirationDateFromFs: Service.GetExpirationDateFromFs = async (
  pathToFile: string
) => {
  const data = await readFile(pathToFile, {
    encoding: "utf-8",
  });

  return new Date(data);
};

export const saveNewExpirationDateToFs: Service.SaveNewExpirationDateToFs =
  async (pathToFile: string, newDate: Date) => {
    return writeFile(newDate.toUTCString(), pathToFile, {
      encoding: "utf-8",
    });
  };

export const isDateExpired: Service.IsDateExpired = (expirationDate: Date) =>
  new Date() < expirationDate;

export const calcNewExpirationDate: Service.CalcNewExpirationDate = (
  daysToNextCleanup: number
) => {
  let date = new Date();

  date.setDate(date.getDate() + daysToNextCleanup);

  return date;
};

// TODO:
export const sendRequestToCleanupService: Service.SendRequestToCleanupService =
  (url: string) => {
    return Promise.resolve();
  };

/* 
await readFile(pathToFileWithData, {
            encoding: "utf-8",
          })

    getExpirationDateFromFs: () => Promise<Date>,
    saveNewExpirationDateToFirestore: (date: Date) => Promise<void>,
    saveNewExpirationDateToFs: (date: Date) => Promise<void>,
    sendRequestToCleanupService: () => Promise<void>,
    calcNewExpirationData: () => Date,
    //(data.expirationDateFromFirestore as Date) < expirationData
    isDateExpired: (date: Date) => boolean,

    writeFile(
              newExpirationDate.toUTCString(),
              pathToFileWithData,
              {
                encoding: "utf-8",
              }
            );
*/
