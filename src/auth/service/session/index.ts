import {
  chain,
  compose,
  Done,
  elif,
  map,
  NI_Next,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { existsSync } from "fs";
import { writeFile, readFile } from "fs/promises";
import { join } from "path";
import { Logger } from "winston";
import { Path } from "../../../types";

const sessionFile = join(process.cwd(), "data", "session.json");

// TODO: ADD SAVE USER FOR 1 DAY

type SaveRoleProps = {
  userUid: string;
  isEditor: boolean;
};

type StorageData = {
  storageData?: any;
};

type RoleData<T> = T & StorageData;

export const getInfoFromFile_ = (
  pathToSessionFile: Path,
  readFile_: typeof readFile,
  existsSync_: typeof existsSync
) =>
  elif<any, Promise<Done | NI_Next<StorageData>>>(
    () => existsSync_(pathToSessionFile) === true,
    compose(
      async (props: CheckRoleProps) => ({
        ...props,
        storageData: await readFile_(pathToSessionFile, {
          encoding: "utf-8",
        }),
      }),
      then((data: any) =>
        NI_Next.of({
          ...data,
          storageData: JSON.parse(data.storageData),
        })
      ),
      _catch((err: any) => Done.of(err))
    ),
    (props: CheckRoleProps) =>
      Promise.resolve(
        NI_Next.of({
          ...props,
          storageData: {},
        })
      )
  );

export const getInfoFromFile = getInfoFromFile_(
  sessionFile,
  readFile,
  existsSync
);

export const saveRole_ =
  (
    pathToSessionFile: Path,
    writeFile_: typeof writeFile,
    getInfoFromFile_: typeof getInfoFromFile
  ) =>
  (logger: Logger) =>
    compose<SaveRoleProps, Promise<void>>(
      // get saved roles from file
      getInfoFromFile_,
      // add our role
      then(
        map((data: RoleData<SaveRoleProps>) => ({
          ...data,
          storageData: {
            ...data.storageData,
            [data.userUid]: data.isEditor,
          },
        }))
      ),
      // save to file as json
      then(
        chain(
          compose(
            async (data: RoleData<SaveRoleProps>) => {
              await writeFile_(
                pathToSessionFile,
                JSON.stringify(data.storageData),
                {
                  encoding: "utf-8",
                }
              );
              return data;
            },
            then(NI_Next.of),
            _catch((err: any) => Done.of(err))
          )
        )
      ),
      thenDoneFold(
        // on error
        (err: any) => {
          logger.log("error", `SAVE ROLE TO SESSION`, {
            error: err,
          });
        },
        // on success
        (data: RoleData<SaveRoleProps>) => {
          logger.log("info", `SAVE ROLE TO SESSION`, {
            data,
          });
        }
      )
    );

type CheckRoleProps = {
  userUid: string;
};

// check if user role exists
export const checkRole_ =
  (getInfoFromFile_: typeof getInfoFromFile) => (logger: Logger) =>
    compose<CheckRoleProps, Promise<boolean | null>>(
      // get info from file
      getInfoFromFile_,
      // does we have saved user role
      thenDoneFold(
        // on error
        (err: any) => {
          logger.log("error", `CHECK ROLE`, {
            error: err,
          });

          return null;
        },
        // on success
        (data: RoleData<SaveRoleProps>) => {
          logger.log("info", `CHECK ROLE`, {
            data,
          });

          const isEditorRes = data.storageData[data.userUid];

          return isEditorRes === undefined ? null : isEditorRes;
        }
      )
    );

export const saveRole = saveRole_(sessionFile, writeFile, getInfoFromFile);

export const getRole = checkRole_(getInfoFromFile);
