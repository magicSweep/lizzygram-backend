import { google, drive_v3 } from "googleapis";
import {
  readFile,
  readFileSync,
  createWriteStream,
  createReadStream,
  statSync,
  existsSync,
} from "fs";

/* const parents = [process.env.DRIVE_PARENT_ID];
const private_key = process.env.DRIVE_PRIVATE_KEY;
const client_email = process.env.DRIVE_CLIENT_EMAIL;
const projectId = process.env.PROJECT_ID;

let drive: drive_v3.Drive; */

export const initDrive = async (
  private_key: string,
  client_email: string,
  projectId: string
) => {
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

    return google.drive({
      version: "v3",
      auth: client,
    });
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

export const getFileById_ =
  (drive: drive_v3.Drive) => async (fileId: string) => {
    const res = await drive.files.get({
      fileId,
    });

    return res.data;
  };
