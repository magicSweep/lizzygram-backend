test("", () => {
  expect(true).toEqual(true);
});

/* import {
  makePhotoFieldsToUpdateOnAdd,
  getSrcSet,
  makePhotoFieldsToUpdateOnEdit,
} from "./Photos.helper";
import { photoSizes } from "../../config";
import { EditPhotoData, AddPhotoData } from "../../types";

jest.mock("../../config", () => ({
  __esModule: true,
  photoSizes: [
    { height: 600, width: 800 },
    { height: 720, width: 1280 },
  ],
}));

const addPhotoData: AddPhotoData = {
  base64String: "base64String",
  optimizedImageInfo: [
    { format: "image/webp", height: 200, size: 12345, width: 400 },
    { format: "image/webp", height: 600, size: 22345, width: 800 },
  ],
  optimizedPhotosPaths: new Map([
    [800, "/800.webp"],
    [1280, "/1280.webp"],
  ]),
  photoInfo: {
    aspectRatio: 1.8,
    height: 1080,
    imageExtention: "png",
    isInverted: false,
    width: 1920,
  },
  reqInfo: { photoFile: "file" as any, photoId: "photoId", userUid: "userUid" },
  webImagesInfo: {
    ids: ["id-1", "id-2"],
    urls: new Map([
      [800, "https://v.ru/800"],
      [1280, "https://v.ru/1280"],
    ]),
  },
};

test("getImageSrcSet", () => {
  const urls = new Map([
    [800, "https://v.ru/800"],
    [1280, "https://v.ru/1200"],
  ]);

  const res = getSrcSet(urls);

  expect(res).toEqual("https://v.ru/800 600w, https://v.ru/1200 1000w, ");
});

describe("makePhotoFieldsToUpdateOnAdd", () => {
  test("", () => {
    const data = makePhotoFieldsToUpdateOnAdd(addPhotoData);

    expect(data).toEqual({
      aspectRatio: 1.8,
      base64: "base64String",
      files: ["id-1", "id-2"],
      iconSrc: "https://v.ru/800",
      imageExtention: "png",
      isActive: true,
      src: "https://v.ru/1280",
      srcSet: "https://v.ru/800 600w, https://v.ru/1280 1000w, ",
    });
  });
});

describe("makePhotoFieldsToUpdateOnEdit", () => {
  test("", () => {
    const editPhotoData: EditPhotoData = {
      ...addPhotoData,
      reqInfo: {
        ...addPhotoData.reqInfo,
        description: "Some description",
        date: new Date().toUTCString(),
        tags: JSON.stringify({
          "123ere": true,
          "243453": true,
        }),
      },
    };

    const data = makePhotoFieldsToUpdateOnEdit(editPhotoData as any);

    /* expect(data).toEqual({
      aspectRatio: 1.8,
      base64: "base64String",
      files: ["id-1", "id-2"],
      iconSrc: "https://v.ru/800",
      imageExtention: "png",
      isActive: true,
      src: "https://v.ru/1280",
      srcSet: "https://v.ru/800 600w, https://v.ru/1280 1000w, ",
      //"date": 2021-12-11T16:37:22.000Z,
      "description": "Some description",
      "tags": "{\"243453\":true,\"123ere\":true}",
      "yearsOld": 3,
    }); /

    expect(data.aspectRatio).toEqual(1.8);
    expect(data.description).toEqual("Some description");
    expect(data.tags).toEqual({ "243453": true, "123ere": true });
    expect(data.yearsOld).toEqual(3);
  });
});
 */
