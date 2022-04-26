import { join } from "path";
import { getStream, postFormData } from "../../service/request";
import { existsSync, unlink, createReadStream, readFile } from "fs";
import { promisify } from "util";
import {
  chain,
  compose,
  Done,
  map,
  NI_Next,
  then,
  thenDoneFold,
  _catch,
} from "fmagic";
import { logger } from "../../service/logger/winston";
//import FormData from "form-data";
const FormData = require("form-data");
//const { Blob } = require("buffer");
import { mainPhotoUrl } from "../../config";
import { Path } from "../../types";

const pathToPhoto = join(process.cwd(), "src", "static", "13.jpg");

// add photo
export const testAddPhoto = compose<{ pathToPhoto: Path }, Promise<any>>(
  (data: any) => {
    var formData = new FormData();

    formData.append("file", createReadStream(data.pathToPhoto));

    data.formData = formData;

    return NI_Next.of(data);
  },
  // send request to worker
  chain((data: any) =>
    compose(
      async () => ({
        ...data,
        response: await postFormData(
          `http://localhost:3009/${mainPhotoUrl}`,
          data.formData as any
        ),
      }),
      then((data: any) => NI_Next.of(data)),
      _catch((err: any) =>
        Done.of({
          ...data,
          error: err.message,
        })
      )
    )()
  ),
  thenDoneFold(
    (data: any) =>
      logger.log("error", "ADD PHOTO TEST ERROR", {
        error: data.error,
        //responseData: data.response.data,
      }),
    (data: any) => {
      logger.log("info", "ADD PHOTO TEST SUCCESS", {
        responseData: data.response !== undefined ? data.response.data : "",
      });
    }
  )
);

// download photo
//   - send request with query param userUid + googleDriveId + .jpeg
//   - get stream response
//   - check saved photo( and delete)
export const testDownloadPhoto = async () => {
  const pathToPhoto = join(process.cwd(), "upload", "streamedPhoto.jpg");

  //console.log("PATH TO PHOTO", pathToPhoto);

  await getStream(
    "http://localhost:3009/download/adfs/hello.jpeg",
    //"http://localhost:3009/download",
    pathToPhoto
  );

  if (existsSync(pathToPhoto) !== true) {
    console.error("Photo not downloaded....");
  }

  /*  console.assert(existsSync(pathToPhoto) === true, {
    errorMsg: "Photo not downloaded....",
  }); */

  await promisify(unlink)(pathToPhoto);

  if (existsSync(pathToPhoto) === true) {
    console.error(`Photo was not deleted.... | ${pathToPhoto}`);
  }

  /* console.assert(existsSync(pathToPhoto) === false, {
    errorMsg: `Photo was not deleted.... | ${pathToPhoto}`,
  }); */

  console.log("NO ERROR MSGS - MEANS SUCCESS DOWNLOAD TEST.");
};
