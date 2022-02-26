import { join } from "path";
import { getStream, postFormData } from "../service/request";
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
import { logger } from "../logger/winston";
//import FormData from "form-data";
const FormData = require("form-data");
//const { Blob } = require("buffer");
import { addPhotoUrl, editPhotoUrl } from "../config";
import { addPhoto } from "../photos/service/PhotosDb";

const userUid = "kMwibQErO6dDH6gf3entRLqFBop2";
let photoId = "88354434515782";

const getPhotoId = () => photoId;
const setPhotoId = (photoId_: string) => (photoId = photoId_);

// add photo
export const testAddPhoto = compose<void, Promise<any>>(
  () =>
    NI_Next.of({
      pathToPhoto: join(process.cwd(), "src", "static", "13.jpg"),
      photoId: (90000000000000 - Date.now()).toString(),
      userUid,
    }),
  // add photo to firestore
  chain((data: any) =>
    compose(
      async () => {
        await addPhoto(
          {
            id: data.photoId,
            tags: {
              werwew: true,
              sfefew: true,
            },
            isActive: false,
            description: "Hello, my friend",
            date: new Date("2020-05-08"),
            addedByUserUID: "kMwibQErO6dDH6gf3entRLqFBop2",
          } as any,
          data.photoId
        );

        return data;
      },
      then((data: any) => NI_Next.of(data)),
      _catch((err: any) =>
        Done.of({
          ...data,
          error: err.message,
        })
      )
    )()
  ),
  // make form data
  then(
    map((data: any) => {
      var formData = new FormData();

      formData.append("photoId", data.photoId);
      formData.append("userUid", data.userUid);
      formData.append("file", createReadStream(data.pathToPhoto));

      data.formData = formData;

      return data;
    })
  ),
  // send request to worker
  then(
    chain((data: any) =>
      compose(
        async () => ({
          ...data,
          response: await postFormData(
            `http://localhost:3009/${addPhotoUrl}`,
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
    )
  ),
  thenDoneFold(
    (data: any) =>
      logger.log("error", "ADD PHOTO TEST ERROR", {
        photoId: data.photoId,
        userUid: data.userUid,
        error: data.error,
        //responseData: data.response.data,
      }),
    (data: any) => {
      setPhotoId(data.photoId);

      logger.log("info", "ADD PHOTO TEST RESULT", {
        photoId: data.photoId,
        userUid: data.userUid,
        responseData: data.response !== undefined ? data.response.data : "",
      });
    }
  )
  // get info about photo from firestore
  // check google drive file
  // check cloudinary images
  // remove firebase, google drive, cloudinary
);

// edit photo
// send request with FormData - photoFile, date, tags, description
export const testEditPhoto = compose<void, Promise<any>>(
  () =>
    NI_Next.of({
      pathToPhoto: join(process.cwd(), "src", "static", "dream.png"),
      photoId: getPhotoId(),
      userUid,
    }),
  // make form data

  map((data: any) => {
    var formData = new FormData();

    formData.append("photoId", data.photoId);
    formData.append("userUid", data.userUid);
    formData.append("date", new Date("2017-03-02").toUTCString());
    formData.append("tags", JSON.stringify({ boom2: true, groom1: true }));
    formData.append("description", "Goodbye, bye, bye...");
    formData.append("file", createReadStream(data.pathToPhoto));

    data.formData = formData;

    return data;
  }),
  // send request to worker
  chain((data: any) =>
    compose(
      async () => ({
        ...data,
        response: await postFormData(
          `http://localhost:3009/${editPhotoUrl}`,
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
      logger.log("error", "EDIT PHOTO TEST ERROR", {
        photoId: data.photoId,
        userUid: data.userUid,
        error: data.error,
        responseData: {
          status: data.response !== undefined ? data.response.status : "",
          statusText:
            data.response !== undefined ? data.response.statusText : "",
          data: data.response !== undefined ? data.response.data : "",
        },
      }),
    (data: any) => {
      photoId = data.photoId;

      logger.log("info", "EDIT PHOTO TEST RESULT", {
        photoId: data.photoId,
        userUid: data.userUid,
        responseData: {
          status: data.response !== undefined ? data.response.status : "",
          statusText:
            data.response !== undefined ? data.response.statusText : "",
          data: data.response !== undefined ? data.response.data : "",
        },
      });
    }
  )
  // get info about photo from firestore
  // check google drive file
  // check cloudinary images
  // remove firebase, google drive, cloudinary
);

// download photo
//   - send request with query param userUid + googleDriveId + .jpeg
//   - get stream response
//   - check saved photo( and delete)
export const testDownloadPhoto = async () => {
  const pathToPhoto = join(process.cwd(), "upload", "streamedPhoto.jpg");

  //console.log("PATH TO PHOTO", pathToPhoto);

  await getStream(
    "http://localhost:3009/download/kMwibQErO6dDH6gf3entRLqFBop21JpdtwHEsOnaYI9TEFID4qtIErE3vV_vs",
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
