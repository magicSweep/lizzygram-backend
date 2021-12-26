import { readFile, writeFile, existsSync, unlinkSync } from "fs";
import { promisify } from "util";
import { join } from "path";
import {
  init,
  getAllFilesInfo,
  isFileExists,
  getFileInfoById,
  searchFileByName,
  getFileIdByItsName,
  downloadImage,
  uploadImage,
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

  describe.skip("getAllFiles", () => {
    test("", async () => {
      const files = await getAllFilesInfo();

      expect(files).toEqual("hello");
      //expect(files).not.toEqual(undefined);
      //expect((files as any).length).toEqual(5);
    });
  });

  describe.skip("isFileExists", () => {
    test("", async () => {
      const result = await isFileExists("18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp");

      expect(result).toEqual(true);
    });
  });

  describe.skip("getFileById", () => {
    test("", async () => {
      const file = await getFileInfoById("18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp");

      expect(file.name).toEqual("photo_1607217829308.jpg");
    });
  });

  describe.skip("searchFileByName", () => {
    test("", async () => {
      const file = await searchFileByName("photo_1607217829308.jpg");

      expect(file).not.toEqual(undefined);
      expect((file as any).name).toEqual("photo_1607217829308.jpg");
    });
  });

  describe.skip("getFileIdByItsName", () => {
    test("", async () => {
      const fileId = await getFileIdByItsName("photo_1607217829308.jpg");

      expect(fileId).toEqual("18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp");
    });
  });

  // downloadImageFromDrive
  describe.skip("downloadImageFromDrive", () => {
    test("", async () => {
      if (existsSync(pathToDownloadedPhoto)) {
        unlinkSync(pathToDownloadedPhoto);
      }

      const res = await downloadImage(
        "18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp",
        pathToDownloadedPhoto
      );

      expect(existsSync(pathToDownloadedPhoto)).toEqual(true);
    });
  });

  describe.skip("uploadImageToDrive", () => {
    test("", async () => {
      const file = await uploadImage("photo_234ERETR.jpg", pathToUploadPhoto);

      expect(file).toEqual("hello");
      //@ts-ignore
      //const result = await isFileExists((file).id);

      //expect(result).toEqual(true);
    });
  });

  describe.skip("uploadImageToDrive", () => {
    test("", async () => {
      const file = await uploadImage("photo_234ERETR.jpg", pathToUploadPhoto);

      //@ts-ignore
      const result = await isFileExists(file.data.id);

      expect(result).toEqual(true);
    });
  });

  // updateImageFile
  describe.skip("updateImageFile", () => {
    test("", async () => {
      const originalPhotoInfo = await uploadImage(
        "photo_234ERETR.jpg",
        pathToUploadPhoto
      );

      await wait(3000);

      //@ts-ignore
      const photoInfo = await updateImageFile(
        originalPhotoInfo.id as string,
        pathToAnotherUploadPhoto
      );

      expect(photoInfo.id).toEqual(originalPhotoInfo.id);

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

const files = [
  [
    { id: "1vXh3ZKA_tIOP7tRLpaU0yVRGeEDRLmnv", name: "photo_234ERETR.jpg" },
    {
      id: "18TjpqUaWK5fB3WHiLwsBBS4lengF9aRp",
      name: "photo_1607217829308.jpg",
    },
    {
      id: "1rD94UnpAjw-PnPaqDPpdBTsjzqKxeeTA",
      name: "photo_1624900411976.jpg",
    },
    {
      id: "1m1Yiq1_Jjyp9SHddEmvsZc2NIIYYEsUb",
      name: "photo_1624654754888.jpg",
    },
    {
      id: "1txVP3xK_-OdhCakIhssDrMXlt5F1vmA0",
      name: "photo_1617724414492.jpg",
    },
    {
      id: "1neNtpBxnspd0BF73DeyI0sTtrIs4ong6",
      name: "photo_1617724182997.jpg",
    },
    {
      id: "1hUpH_g74NuCM8yTaJyMmqqzSosUvhZZJ",
      name: "photo_1615103573587.jpg",
    },
    {
      id: "1DE8cMTtU7NmD3rOifNSZmyt75uGAFsU2",
      name: "photo_1617298715059.jpg",
    },
    {
      id: "12foDmCbGL8A0aY38mofeL9f6QwG8OjPc",
      name: "photo_1616525194248.jpg",
    },
    {
      id: "1kXyGmcnD9xzd5-MufDPeJgJTvbVEk-l6",
      name: "photo_1614929860541.jpg",
    },
    {
      id: "1WODhnDiKQi0uD8CAnVKEjpRq4BZXe1Kr",
      name: "photo_1615114373525.jpg",
    },
    {
      id: "1WUR9g-tmTAHxV0cZv0noStcMqYWrsz-G",
      name: "photo_1615114278684.jpg",
    },
    {
      id: "1Bvp1ED8Hqoze52nd1VHaDI35LqBax5OT",
      name: "photo_1613166235057.jpg",
    },
    {
      id: "1uim6K8Yds7RyIm58skUVZCPOQe_Rshw5",
      name: "photo_1611880301729.jpg",
    },
    {
      id: "1haHRtOAcZnU5o-lOVipgP-JmlqG7I-KX",
      name: "photo_1611860357983.jpg",
    },
    {
      id: "1OkltrVIDGI_Y-mYeyB9PXcMR7Xho40gj",
      name: "photo_1614929925812.jpg",
    },
    {
      id: "107qmycBPDGSiACOYxXr-hAzMUYShiO7L",
      name: "photo_1613165750475.jpg",
    },
    {
      id: "1uVoto1oUptqst5H3FYKdvy08iYcw9hlm",
      name: "photo_1611951520031.png",
    },
    {
      id: "1J4yFOQMprUYK_lMmbz5NO_eSAGGmrcou",
      name: "photo_1611885664598.png",
    },
    {
      id: "1lSdMEDflnkpyYQj6pip3v7Wgyc4moU1-",
      name: "photo_1607217697107.jpg",
    },
    { id: "1bpVX8NSlcyaNhT7so3Kuw4gPDA-0wWzO", name: "ladki_hello.jpg" },
    {
      id: "1PzUOQy1aX2Ecjb0bpHxTV5ChI5Q7mOag",
      name: "photo_1607198069885.jpg",
    },
    { id: "1wTRcXEhl_gZ2Ppb6c2RO19M0qeG9xI6P", name: "lizzigram" },
  ],
];
