import { Done, NI_Next } from "fmagic";
import { mainMiddleware_ } from "./main";

const makeOptimizedPhotosAndSaveToWeb = jest.fn((data: any) =>
  Promise.resolve(
    NI_Next.of({
      ...data,
      webImagesInfo: {
        ids: ["300", "400", "500"],
        urls: new Map([
          [300, "/url-300"],
          [400, "/url-400"],
          [500, "/url-500"],
        ]),
      },
    })
  )
);

const makePhotoInfo = jest.fn((data: any) =>
  Promise.resolve(
    NI_Next.of({
      ...data,
      photoInfo: {
        aspectRatio: 1.6,
        imageExtention: "jpeg",
      },
    })
  )
);

const makeBase64 = jest.fn((data: any) =>
  Promise.resolve(
    NI_Next.of({
      ...data,
      makeBase64: "makeBase64",
    })
  )
);

const savePhotoToOriginalPhotoStorage = jest.fn((data: any) =>
  Promise.resolve(
    NI_Next.of({
      ...data,
      googleDriveId: "googleDriveId",
    })
  )
);

const cleanUp_ = jest.fn();
const cleanUp = () => cleanUp_;

const fullCleanUp_ = jest.fn();
const fullCleanUp = () => fullCleanUp_;

let req = {
  file: "file",
};

const logger = {
  log: jest.fn(),
};

const end = jest.fn();

const json = jest.fn(() => ({
  end,
}));

const res = {
  status: () => {
    return {
      json,
      end,
    };
  },
};
const next = jest.fn();

describe("mainMiddleware_", () => {
  const makeMiddleware = mainMiddleware_(
    savePhotoToOriginalPhotoStorage,
    makePhotoInfo,
    makeOptimizedPhotosAndSaveToWeb,
    makeBase64,
    cleanUp,
    fullCleanUp
  )(logger as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If all okey", async () => {
    await makeMiddleware(req as any, res as any, next);

    expect(makePhotoInfo).toHaveBeenCalledTimes(1);
    expect(makeBase64).toHaveBeenCalledTimes(1);

    expect(makeOptimizedPhotosAndSaveToWeb).toHaveBeenCalledTimes(1);
    expect(savePhotoToOriginalPhotoStorage).toHaveBeenCalledTimes(1);
    expect(cleanUp_).toHaveBeenCalledTimes(1);
    expect(fullCleanUp_).toHaveBeenCalledTimes(0);

    expect(logger.log).toHaveBeenCalledTimes(1);
    //expect(logger.log).toHaveBeenNthCalledWith(1, "info", "MAKE MIDDLEWARE SUCCESS", {"DATA": {"googleDriveId": "googleDriveId", "makeBase64": "makeBase64", "photoInfo": {"aspectRatio": 1.6, "imageExtention": "jpeg"}, "reqInfo": {"photoFile": "file"}, "webImagesInfo": {"ids": ["300", "400", "500"], "urls": Map {300 => "/url-300", 400 => "/url-400", 500 => "/url-500"}}}});

    expect(json).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenNthCalledWith(1, {
      data: {
        aspectRatio: 1.6,
        base64: undefined,
        googleDriveId: "googleDriveId",
        imageExtention: "jpeg",
        webImagesInfo: {
          ids: ["300", "400", "500"],
          urls: [
            [300, "/url-300"],
            [400, "/url-400"],
            [500, "/url-500"],
          ],
        },
      },
    });
  });

  test.only("If we got error", async () => {
    savePhotoToOriginalPhotoStorage.mockResolvedValueOnce(
      Done.of({
        error: "Bad fat error",
      }) as any
    );

    makeBase64.mockResolvedValueOnce(
      Done.of({
        error: "Bad base64 fat error",
      }) as any
    );

    await makeMiddleware(req as any, res as any, next);

    /*  expect(makePhotoInfo).toHaveBeenCalledTimes(1);
    expect(makeBase64).toHaveBeenCalledTimes(1);

    expect(makeOptimizedPhotosAndSaveToWeb).toHaveBeenCalledTimes(1);
    expect(savePhotoToOriginalPhotoStorage).toHaveBeenCalledTimes(1); */
    expect(cleanUp_).toHaveBeenCalledTimes(0);
    expect(fullCleanUp_).toHaveBeenCalledTimes(1);

    expect(logger.log).toHaveBeenCalledTimes(1);
    //expect(logger.log).toHaveBeenNthCalledWith(1, "h");

    expect(json).toHaveBeenCalledTimes(0);

    expect(end).toHaveBeenCalledTimes(1);
  });
});
