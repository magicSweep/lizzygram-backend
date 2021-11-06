//export { drive, isFileExists, initDrive } from "./helper";
import { google, drive_v3, GoogleApis } from "googleapis";
import {
  readFile,
  readFileSync,
  createWriteStream,
  createReadStream,
  statSync,
  existsSync,
} from "fs";

export let drive: drive_v3.Drive | unknown = undefined;

// we can init drive somewhere and set it here
export const setDrive = (drive_: drive_v3.Drive) => {
  drive = drive_;
};

export const getDrive = () => drive as drive_v3.Drive;

const parents = [process.env.DRIVE_PARENT_ID];

export const getParents = () => parents as string[];

export const init_ =
  (
    google: GoogleApis,
    private_key: string,
    client_email: string,
    projectId: string,
    setDrive: (drive_: drive_v3.Drive) => void
  ) =>
  async () => {
    /*   let private_key = processEnv.DRIVE_PRIVATE_KEY as string;
    const client_email = processEnv.DRIVE_CLIENT_EMAIL as string;
    const projectId = processEnv.PROJECT_ID as string; */

    try {
      //let private_key = process.env.DRIVE_PRIVATE_KEY;
      if (process.env.IENV === "heroku") {
        private_key = private_key.replace(/\\n/g, "\n");
      }

      const client = await google.auth.getClient({
        credentials: {
          private_key,
          client_email,
        },
        //credentials,
        scopes: "https://www.googleapis.com/auth/drive",
        projectId,
      });

      setDrive(
        google.drive({
          version: "v3",
          auth: client,
        })
      );
    } catch (err) {
      console.group("GOOGLE DRIVE INIT ERROR");
      console.log(
        "process.env.DRIVE_CLIENT_EMAIL",
        process.env.DRIVE_CLIENT_EMAIL
      );
      console.log("ERROR", err);
      console.log("--IENV", process.env.IENV);

      console.groupEnd();
    }
  };

export const init = init_(
  google,
  process.env.DRIVE_PRIVATE_KEY as string,
  process.env.DRIVE_CLIENT_EMAIL as string,
  process.env.PROJECT_ID as string,
  setDrive
);

export const getFileById_ =
  (getDrive: () => drive_v3.Drive) => async (fileId: string) => {
    const res = await getDrive().files.get({
      fileId,
    });

    return res.data;
  };

export const getFileById = getFileById_(getDrive);

export const isFileExists_ =
  (getFileById: (fileId: string) => Promise<drive_v3.Schema$File>) =>
  async (fileId: string) => {
    try {
      await getFileById(fileId);

      return true;
    } catch (err: any) {
      if (err.toString().indexOf("File not found") > 0) {
        return false;
      } else {
        throw err;
      }
    }
  };

export const isFileExists = isFileExists_(getFileById);

export const getAllFiles_ =
  (getDrive: () => drive_v3.Drive) =>
  async (limit: number = 10) => {
    const res = await getDrive().files.list({
      pageSize: limit,
      //files: "nextPageToken, files(id, name)",
    });

    return res.data.files;
  };

export const getAllFiles = getAllFiles_(getDrive);

// GOOGLE DRIVE CAN STORE MANY FILES WITH SAME NAME
// FOR SIMPLISITY WE CLAIM - ONE NAME - ONE ID
export const searchFileByName_ =
  (getDrive: () => drive_v3.Drive) => async (name: string) => {
    const res = await getDrive().files.list({
      q: `name='${name}'`,
      //fields: "nextPageToken, items(id, title)",
    });

    return res.data.files !== undefined /* && res.data.files.length === 1 */
      ? res.data.files[0]
      : undefined;
  };

export const searchFileByName = searchFileByName_(getDrive);

export const getFileIdByItsName_ =
  (searchFileByName_: typeof searchFileByName) => async (name: string) => {
    const fileData = await searchFileByName_(name);

    return fileData ? fileData.id : undefined;
    //await googleDrive.deleteFile(fileData.id);
  };

export const getFileIdByItsName = getFileIdByItsName_(searchFileByName);

/// UPLOAD / DOWNLOAD

export const downloadImageStream_ =
  (getDrive: () => drive_v3.Drive) => async (fileId: string) => {
    const res = await getDrive().files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    return res.data;
  };

export const downloadImageStream = downloadImageStream_(getDrive);

export const downloadImageFromDrive_ =
  (getDrive: () => drive_v3.Drive) =>
  async (fileId: string, destPath: string) => {
    const dest = createWriteStream(destPath);

    const res: any = await getDrive().files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    return new Promise((resolve, reject) => {
      res.data
        .on("end", () => {
          //console.log("Done downloading file from Google drive.");
          resolve(undefined);
        })
        .on("error", (err: any) => {
          //console.error("Error downloading file from Google drive.");
          reject(err);
        })
        /*  .on("data", (data) => {
          progress += data.length;
          if (process.stdout.isTTY) {
            process.stdout.clearLine(0);
            process.stdout.cursorTo(0);
            process.stdout.write(`Downloaded ${progress} bytes`);
          }
        }) */
        .pipe(dest);
    });
  };

export const downloadImageFromDrive = downloadImageFromDrive_(getDrive);

export const uploadImageToDrive_ =
  (getDrive: () => drive_v3.Drive, getParents: () => string[]) =>
  (fileName: string, pathToPhoto: string, mimeType: string = "image/jpeg") => {
    //const fileSize = statSync(pathToPhoto).size;

    return getDrive().files.create(
      {
        requestBody: {
          parents: getParents(),
          name: fileName,
          mimeType,
        },
        media: {
          mimeType,
          body: createReadStream(pathToPhoto),
        },
      }
      /* {
      // Use the `onUploadProgress` event from Axios to track the
      // number of bytes uploaded to this point.
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fileSize) * 100;
        console.log(`${Math.round(progress)}% complete`);
      },
    } */
    );
  };

export const uploadImageToDrive = uploadImageToDrive_(getDrive, getParents);

export const updateImageFile_ =
  (getDrive: () => drive_v3.Drive) =>
  (
    fileId: string,
    pathToPhotoFile: string,
    mimeType: string = "image/jpeg"
  ) => {
    return getDrive().files.update({
      fileId,
      media: {
        mimeType,
        body: createReadStream(pathToPhotoFile),
      },
    });

    //console.log(`Response - ${JSON.stringify(res)}`);
  };

export const updateImageFile = updateImageFile_(getDrive);

///////// DELETE

export const deleteFile_ =
  (getDrive: () => drive_v3.Drive) => (fileId: string) => {
    return getDrive().files.delete({
      fileId,
    });

    //console.log(`Response - ${JSON.stringify(res)}`);
  };

export const deleteFile = deleteFile_(getDrive);

export const deleteAllFiles =
  (
    getDrive: () => drive_v3.Drive,
    getAllFiles: (limit: number) => Promise<drive_v3.Schema$File[]>,
    getParents: () => string[]
  ) =>
  async () => {
    const files = await getAllFiles(30);

    const promises = [];

    if (files.length === 0) {
      console.log("No files found.");
    } else {
      //console.log("Files:");
      for (const file of files) {
        //console.log(`${file.name} (${file.id})`);
        //console.log(` - File - ${file.name} | ${file.id} | ${file.mimeType}`);
        if (file.id === getParents()[0]) continue;

        promises.push(getDrive().files.delete({ fileId: file.id as string }));
        //console.log(` - Deleted - ${file.name} | ${file.id} | ${file.mimeType}`);
      }

      return Promise.all(promises);

      //console.log(`Deleted ${files.length - 1} files`);
    }
  };

export const removeFilesByNames =
  (
    deleteFile: (id: string) => Promise<void>,
    searchFileByName: (name: string) => Promise<drive_v3.Schema$File>
  ) =>
  async (names: string[]) => {
    if (!names || !names.length || names.length === 0)
      throw new Error("No names...");

    const promises = [];

    for (let name of names) {
      promises.push(searchFileByName(name));
    }

    const files = await Promise.all(promises);

    //const idsToDelete: string[] = [];
    const delPromises = [];

    for (let file of files) {
      if (file) {
        delPromises.push(deleteFile(file.id as string));
      }
    }

    return Promise.all(delPromises);
  };
