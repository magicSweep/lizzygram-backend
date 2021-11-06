import { readFile, writeFile, existsSync, unlinkSync } from "fs";
import { promisify } from "util";
import { join } from "path";
import {
  init,
  getAllFiles,
  isFileExists,
  getFileById,
  searchFileByName,
  getFileIdByItsName,
  downloadImageFromDrive,
  uploadImageToDrive,
  deleteFile,
  updateImageFile,
} from ".";
import wait from "waait";
import { drive_v3 } from "googleapis";

const pathToDownloadedPhoto = join(process.cwd(), "upload", "img.jpg");
const pathToUploadPhoto = join(process.cwd(), "upload", "13.jpg");
const pathToAnotherUploadPhoto = join(process.cwd(), "upload", "12.jpg");

describe("Google drive", () => {
  beforeAll(async () => {
    await init();
  });

  describe.only("getAllFiles", () => {
    test("", async () => {
      const files = await getAllFiles(5);

      expect(files).not.toEqual(undefined);
      expect((files as any).length).toEqual(5);
    });
  });

  describe("isFileExists", () => {
    test("", async () => {
      const result = await isFileExists("18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp");

      expect(result).toEqual(true);
    });
  });

  describe("getFileById", () => {
    test("", async () => {
      const file = await getFileById("18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp");

      expect(file.name).toEqual("photo_1607217829308.jpg");
    });
  });

  describe("searchFileByName", () => {
    test("", async () => {
      const file = await searchFileByName("photo_1607217829308.jpg");

      expect(file).not.toEqual(undefined);
      expect((file as any).name).toEqual("photo_1607217829308.jpg");
    });
  });

  describe("getFileIdByItsName", () => {
    test("", async () => {
      const fileId = await getFileIdByItsName("photo_1607217829308.jpg");

      expect(fileId).toEqual("18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp");
    });
  });

  // downloadImageFromDrive
  describe("downloadImageFromDrive", () => {
    test("", async () => {
      if (existsSync(pathToDownloadedPhoto)) {
        unlinkSync(pathToDownloadedPhoto);
      }

      const res = await downloadImageFromDrive(
        "18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp",
        pathToDownloadedPhoto
      );

      expect(existsSync(pathToDownloadedPhoto)).toEqual(true);
    });
  });

  describe("uploadImageToDrive", () => {
    test("", async () => {
      const file = await uploadImageToDrive(
        "photo_234ERETR.jpg",
        pathToUploadPhoto
      );

      expect(file.data).toEqual("hello");
      //@ts-ignore
      //const result = await isFileExists((file).id);

      //expect(result).toEqual(true);
    });
  });

  describe.skip("uploadImageToDrive", () => {
    test("", async () => {
      const file = await uploadImageToDrive(
        "photo_234ERETR.jpg",
        pathToUploadPhoto
      );

      //@ts-ignore
      const result = await isFileExists(file.data.id);

      expect(result).toEqual(true);
    });
  });

  // updateImageFile
  describe.skip("updateImageFile", () => {
    test("", async () => {
      const file = await uploadImageToDrive(
        "photo_234ERETR.jpg",
        pathToUploadPhoto
      );

      await wait(3000);

      //@ts-ignore
      const res = await updateImageFile(file.data.id, pathToAnotherUploadPhoto);

      expect(res.data.id).toEqual(file.data.id);

      //expect(file.data).toEqual("hello");
      //@ts-ignore
      //const result = await isFileExists((file).id);

      //expect(result).toEqual(true);
    });
  });

  describe.skip("deleteFile", () => {
    test("", async () => {
      //@ts-ignore
      const fileId: string = await getFileIdByItsName("photo_234ERETR.jpg");

      await deleteFile(fileId);

      const result = await isFileExists(fileId);

      expect(result).toEqual(false);
    });
  });
});
