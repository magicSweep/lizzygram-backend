import {
  chain,
  compose,
  map,
  Next,
  Done,
  NI_Next,
  tap,
  then,
  _catch,
} from "fmagic";
import wait from "waait";
import { editPhotoMiddleware } from ".";
import { isValidPhotoDbRecordOnEdit } from "../../service/Validator";
import { getPhoto, updatePhoto } from "../../service/PhotosDb";
import { removePhoto, removePhotos } from "../../service/Fs";
import { update as updateOnGoogleDrive } from "../../service/OriginalPhotoStore";
//import { getPhotoInfo, makePaths, makeOptimizedByWidthPhotoFiles, makeBase64String } from "../service/PhotoTransformations";
import {
  getPhotoInfo,
  makePaths,
  makeBase64String,
  makeOptimizedByWidthPhotoFiles,
} from "../../service/PhotoTransformations";
import {
  makeWebImagesInfo,
  uploadPhotos,
  removePhotos as removePhotosFromWebStore,
} from "../../service/PhotosWebStore";
import { photoSizes } from "../../../config";

jest.mock("../../service/OriginalPhotoStore");
jest.mock("../../service/Validator");
jest.mock("../../service/PhotosDb");
jest.mock("../../service/Fs");
jest.mock("../../service/PhotoTransformations");
jest.mock("../../service/PhotosWebStore");

jest.mock("../../../config", () => ({
  __esModule: true,
  photoSizes: [
    { width: 800, height: 640 },
    { width: 1280, height: 720 },
  ],
}));

let req = {
  file: "file",
  body: {
    photoId: "photoId",
    userUid: "userUid",
    date: new Date().toUTCString(),
    tags: JSON.stringify({ "123ewe": true, "3432dwer": true }),
    description: "Hello, from description",
  },
};

const res = {
  status: () => {
    return {
      json: (data: any) => ({
        end: () => data,
      }),
    };
  },
};

(getPhoto as jest.Mock).mockResolvedValue({
  id: "photo_id",
  src: "src",
  isActive: true,
  addedByUserUID: "userUID",
  files: ["file1", "file2"],
  googleDriveId: "googleDriveId",
});

describe("editPhoto", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If we do not have photo file we do nothing", async () => {
    let anotherReq = {
      file: undefined,
      body: undefined,
    };

    let result: any = await editPhotoMiddleware(
      anotherReq as any,
      res as any,
      {} as any
    );

    expect(makeBase64String).toHaveBeenCalledTimes(0);

    expect(removePhoto).toHaveBeenCalledTimes(0);

    expect(result).toEqual({ data: {}, status: "error" });
  });

  test.only("Firestore record not valid or some error on firestore - we remove upload photo", async () => {
    (isValidPhotoDbRecordOnEdit as jest.Mock).mockReturnValueOnce(
      "No firebase record"
    );

    let result: any = await editPhotoMiddleware(
      req as any,
      res as any,
      {} as any
    );

    expect(result).toEqual({ data: {}, status: "error" });

    expect(getPhoto).toHaveBeenCalledTimes(1);

    expect(removePhoto).toHaveBeenCalledTimes(1);

    expect(isValidPhotoDbRecordOnEdit).toHaveBeenCalledTimes(1);

    expect(isValidPhotoDbRecordOnEdit).toHaveBeenNthCalledWith(
      1,
      "photoId",
      {
        addedByUserUID: "userUID",
        files: ["file1", "file2"],
        googleDriveId: "googleDriveId",
        id: "photo_id",
        isActive: true,
        src: "src",
      },
      "userUid"
    );

    (getPhoto as jest.Mock).mockRejectedValueOnce("Some firestore error");

    await editPhotoMiddleware(req as any, res as any, {} as any);

    expect(result).toEqual({ data: {}, status: "error" });

    expect(getPhoto).toHaveBeenCalledTimes(2);

    expect(removePhoto).toHaveBeenCalledTimes(2);

    expect(isValidPhotoDbRecordOnEdit).toHaveBeenCalledTimes(1);
  });

  test("Error on makePaths - not async operation", async () => {
    (makePaths as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Bad fat error");
    });

    (getPhoto as jest.Mock).mockResolvedValueOnce("photo");

    let result: any = await editPhotoMiddleware(
      req as any,
      res as any,
      {} as any
    );

    expect(result).toEqual({ data: {}, status: "error" });
  });

  test.only("If all okey", async () => {
    let result: any = await editPhotoMiddleware(
      req as any,
      res as any,
      {} as any
    );

    await wait(100);

    expect(getPhoto).toHaveBeenCalledTimes(1);

    expect(isValidPhotoDbRecordOnEdit).toHaveBeenCalledTimes(1);

    expect(makeBase64String).toHaveBeenCalledTimes(1);
    expect(uploadPhotos).toHaveBeenCalledTimes(1);
    expect(makeWebImagesInfo).toHaveBeenCalledTimes(1);

    //expect(makePhotoFieldsToUpdateOnAdd).toHaveBeenCalledTimes(1);

    expect(updatePhoto).toHaveBeenCalledTimes(2);

    expect(updateOnGoogleDrive).toHaveBeenCalledTimes(1);

    expect(removePhoto).toHaveBeenCalledTimes(1);
    expect(removePhotos).toHaveBeenCalledTimes(1);

    expect(removePhotosFromWebStore).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ data: {}, status: "success" });
  });
});
