import { google, drive_v3 } from "googleapis";
import {
  readFile,
  readFileSync,
  createWriteStream,
  createReadStream,
  statSync,
  existsSync,
} from "fs";
import { initDrive as initDrive_, getFileById_ } from "./utils";

const parents = [process.env.DRIVE_PARENT_ID];
const private_key = process.env.DRIVE_PRIVATE_KEY as string;
const client_email = process.env.DRIVE_CLIENT_EMAIL as string;
const projectId = process.env.PROJECT_ID as string;

export let drive: drive_v3.Drive | unknown = null;

// we can init drive somewhere and set it here
export const setDrive = (drive_: drive_v3.Drive) => {
  drive = drive_;
};

export const initDrive = (
  private_key: string,
  client_email: string,
  projectId: string
) => {
  initDrive_(private_key, client_email, projectId).then((drive_) => {
    drive = drive_ as drive_v3.Drive;
  });
};

export const getFileById = getFileById_(drive as drive_v3.Drive);

export const isFileExists = async (fileId: string) => {
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

/* const parents = [process.env.DRIVE_PARENT_ID];
const private_key = process.env.DRIVE_PRIVATE_KEY;
const client_email = process.env.DRIVE_CLIENT_EMAIL;
const projectId = process.env.PROJECT_ID;

let drive: drive_v3.Drive; */

/* export const isFileExists = async ( fileId: string) => {

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

export const  getFileById = (drive: drive_v3.Drive) => async (fileId: string) => {

    const res = await drive.files.get({
      fileId,
    });

    return res.data;
  }; */

/* getAllFiles = async (limit: number = 10) => {
    if (!this.drive) throw new Error("Do you forget call init?");

    const res = await this.drive.files.list({
      pageSize: limit,
      //files: "nextPageToken, files(id, name)",
    });

    return res.data.files;
  };

  getFileIdByItsName = async (name: string) => {
    const fileData = await this.searchFileByName(name);

    return fileData ? fileData.id : undefined;
    //await googleDrive.deleteFile(fileData.id);
  };

  searchFileByName = async (name: string) => {
    if (!this.drive) throw new Error("Do you forget call init?");

    const res = await this.drive.files.list({
      q: `name='${name}'`,
      //fields: "nextPageToken, items(id, title)",
    });

    return res.data.files.length === 1 ? res.data.files[0] : undefined;
  };

  removeFilesByNames = async (names: string[]) => {
    if (!names || !names.length || names.length === 0)
      throw new Error("No names...");

    const promises = [];

    for (let name of names) {
      promises.push(this.searchFileByName(name));
    }

    const files = await Promise.all(promises);

    //const idsToDelete: string[] = [];
    const delPromises = [];

    for (let file of files) {
      if (file) {
        delPromises.push(this.deleteFile(file.id));
      }
    }

    return Promise.all(delPromises);
  };

  uploadImageToDrive = (
    fileName: string,
    pathToPhoto: string,
    mimeType: string = "image/jpeg"
  ) => {
    if (!this.drive) throw new Error("Do you forget call init?");

    //const fileSize = statSync(pathToPhoto).size;

    return this.drive.files.create(
      {
        requestBody: {
          parents: this.parents,
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
      } /
    );
  };

  updateImageFile = (
    fileId: string,
    pathToPhotoFile: string,
    mimeType: string = "image/jpeg"
  ) => {
    if (!this.drive) throw new Error("Do you forget call init?");

    return this.drive.files.update({
      fileId,
      media: {
        mimeType,
        body: createReadStream(pathToPhotoFile),
      },
    });

    //console.log(`Response - ${JSON.stringify(res)}`);
  };

  downloadImageStream = async (fileId: string) => {
    if (!this.drive) throw new Error("Do you forget call init?");

    const res = await this.drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    return res.data;
  };

  downloadImageFromDrive = async (fileId: string, destPath: TPath) => {
    if (!this.drive) throw new Error("Do you forget call init?");

    //let progress = 0;

    //const destPath = join(__dirname, "stewart.jpg");

    const dest = createWriteStream(destPath);

    const res: any = await this.drive.files.get(
      { fileId, alt: "media" },
      { responseType: "stream" }
    );

    return new Promise((resolve, reject) => {
      res.data
        .on("end", () => {
          //console.log("Done downloading file from Google drive.");
          resolve(undefined);
        })
        .on("error", (err) => {
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
        }) /
        .pipe(dest);
    });
  };

  deleteFile = (fileId: string) => {
    if (!this.drive) throw new Error("Do you forget call init?");

    return this.drive.files.delete({
      fileId,
    });

    //console.log(`Response - ${JSON.stringify(res)}`);
  };

  deleteAllFiles = async () => {
    if (!this.drive) throw new Error("Do you forget call init?");

    const files = await this.getAllFiles(100);

    const promises = [];

    if (files.length === 0) {
      console.log("No files found.");
    } else {
      //console.log("Files:");
      for (const file of files) {
        //console.log(`${file.name} (${file.id})`);
        //console.log(` - File - ${file.name} | ${file.id} | ${file.mimeType}`);
        if (file.id === this.parents[0]) continue;

        promises.push(this.drive.files.delete({ fileId: file.id }));
        //console.log(` - Deleted - ${file.name} | ${file.id} | ${file.mimeType}`);
      }

      return Promise.all(promises);

      //console.log(`Deleted ${files.length - 1} files`);
    }
  }; */
