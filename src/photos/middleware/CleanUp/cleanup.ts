import { Logger } from "winston";
import {
  chain,
  compose,
  cond,
  Done,
  elif,
  map,
  NI_Next,
  tap,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { existsSync as existsSync_ } from "fs";
import { cleanupCnf } from "../../../config";
import * as Service from "./types";

export type CleanupData = {
  config: typeof cleanupCnf;
  isFileExists: boolean;
  isCleanupDataExpires: boolean;
  expirationDate?: Date;
  //expirationDateFromFile?: Date;
  //expirationDateFromFirestore?: Date;
  newExpirationDate?: Date;
  error?: any;
};

let expirationDate: Date;

export const getExpirationDate = () => expirationDate;
export const setExpirationDate = (newExpirationDate: Date) =>
  (expirationDate = newExpirationDate);

/* export const cleanUpMiddleware_ =
  (
    getExpirationDateFromFirestore: () => Promise<Date>,
    saveNewExpirationDateToFirestore: (date: Date) => Promise<void>,
    sendRequestToCleanupService: () => Promise<void>
  ) =>
  (logger: Logger) =>
  (req: Request, res: Response, next: NextFunction) => {
    next();
  }; */

// req.body - {googleDriveId: string, webImagesInfo: WebImagesInfo}
export const onCleanup_ =
  (
    getExpirationDate: () => Date,
    setExpirationDate: (date: Date) => void,
    getExpirationDateFromFirestore: Service.GetExpirationDateFromFirestore,
    // getExpirationDateFromFs: Service.GetExpirationDateFromFs,
    saveNewExpirationDateToFirestore: Service.SaveNewExpirationDateToFirestore,
    //saveNewExpirationDateToFs: Service.SaveNewExpirationDateToFs,
    sendRequestToCleanupService: Service.SendRequestToCleanupService,
    calcNewExpirationDate: Service.CalcNewExpirationDate,
    //(data.expirationDateFromFirestore as Date) < expirationData
    isDateExpired: Service.IsDateExpired
    //existsSync: typeof existsSync_
  ) =>
  (logger: Logger) =>
    compose<typeof cleanupCnf, Promise<void>>(
      (cnf: typeof cleanupCnf) => ({
        config: cnf,
        expirationDate: getExpirationDate(),
        //isFileExists: existsSync(cnf.pathToFileWithExpirationData),
      }),
      elif<CleanupData, Promise<CleanupData>>(
        ({ expirationDate }: CleanupData) => expirationDate !== undefined,
        (data: CleanupData) => Promise.resolve(data),
        async (data: CleanupData) => ({
          ...data,
          expirationDate: await getExpirationDateFromFirestore(
            data.config.collectionName,
            data.config.docId
          ),
        })
      ),
      /* elif<CleanupData, Promise<any>>(
        ({ isFileExists }: CleanupData) => isFileExists === true,
        async (data: CleanupData) => ({
          ...data,
          expirationDateFromFile: await getExpirationDateFromFs(
            data.config.pathToFileWithExpirationData
          ),
        }),
        async (data: CleanupData) => ({
          ...data,
          expirationDateFromFirestore: await getExpirationDateFromFirestore(
            data.config.collectionName,
            data.config.docId
          ),
        })
      ), */
      then(
        elif(
          ({ expirationDate }: CleanupData) =>
            isDateExpired(expirationDate as Date) === false,
          (data: CleanupData) =>
            Done.of({ ...data, isCleanupDataExpires: false }),
          (data: CleanupData) =>
            NI_Next.of({ ...data, isCleanupDataExpires: true })
        )
      ),
      /* then(
        cond([
          [
            ({
              expirationDateFromFile,
              expirationDateFromFirestore,
            }: CleanupData) =>
              expirationDateFromFile === undefined &&
              expirationDateFromFirestore !== undefined,
            (data: CleanupData) =>
              isDateExpired(data.expirationDateFromFirestore as Date) === false
                ? Done.of({ ...data, isCleanupDataExpires: false })
                : NI_Next.of({ ...data, isCleanupDataExpires: true }),
          ],
          [
            ({
              expirationDateFromFile,
              expirationDateFromFirestore,
            }: CleanupData) =>
              expirationDateFromFile !== undefined &&
              expirationDateFromFirestore === undefined,
            (data: CleanupData) =>
              isDateExpired(data.expirationDateFromFile as Date) === false
                ? Done.of({ ...data, isCleanupDataExpires: false })
                : NI_Next.of({ ...data, isCleanupDataExpires: true }),
          ],
          [
            () => true,
            (data: CleanupData) =>
              Done.of({
                ...data,
                error: "Something vierd happened...",
              }),
          ],
        ])
      ), */
      //then(tap((data: any) => console.log("-----------BIIIIIIIIIIIII", data))),
      then(
        map((data: CleanupData) => ({
          ...data,
          newExpirationDate: calcNewExpirationDate(
            data.config.daysToNextCleanup
          ),
        }))
      ),
      /* then(
        tap((data: any) => console.log("-----------BIIIIIIIIIIIII54", data))
      ), */
      // send request to clean up service
      // save new expiration date to file and firestore
      then(
        chain(
          compose(
            async (data: CleanupData) => {
              const newExpirationDate = data.newExpirationDate as Date;

              setExpirationDate(newExpirationDate);

              await Promise.all([
                sendRequestToCleanupService(data.config.cleanupServiceUrl),
                saveNewExpirationDateToFirestore(
                  data.config.collectionName,
                  data.config.docId,
                  newExpirationDate
                ),
                /* saveNewExpirationDateToFs(
                  data.config.pathToFileWithExpirationData,
                  newExpirationDate
                ), */
              ]);

              return data;
            },
            then(NI_Next.of),
            _catch((error: any) => Done.of({ error }))
          )
        )
      ),
      _catch((err: any) => Done.of({ error: err })),
      thenDoneFold(
        (data: CleanupData) => {
          if (data.error !== undefined) {
            logger.log("error", "ERROR ON CLEAN UP MIDDLEWARE", {
              data,
            });
          }
        },
        (data: CleanupData) => {
          logger.log("info", "SUCCESS UPDATE CLEAN_UP EXPIRATION DATE", {
            data,
          });
        }
      )
    );
