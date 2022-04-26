import {
  makePhotoInfo_,
  makeBase64_,
  makeOptimizedPhotosAndSaveToWeb_,
} from "./main.controller";

describe("makePhotoInfo_", () => {
  const getPhotoInfo = jest.fn((pathToPhoto: string) =>
    Promise.resolve({
      aspectRatio: 1.8,
      imageExtention: "tiff",
      isInverted: true,
      width: 400,
      height: 400,
    })
  );

  const data = {
    reqInfo: {
      photoFile: {
        path: "/super-path/to/",
      },
    },
  };

  const makePhotoInfo = makePhotoInfo_(getPhotoInfo as any);

  test("If all okey we populate data with photo info", async () => {
    const res = await makePhotoInfo(data as any);

    expect(getPhotoInfo).toHaveBeenCalledTimes(1);
    expect(getPhotoInfo).toHaveBeenNthCalledWith(1, "/super-path/to/");

    expect(res.isDone).toEqual(false);
    expect(res.value).toEqual({
      photoInfo: {
        aspectRatio: 1.8,
        height: 400,
        imageExtention: "tiff",
        isInverted: true,
        width: 400,
      },
      reqInfo: { photoFile: { path: "/super-path/to/" } },
    });
  });

  test("If we got error we populate data with error and return Done", async () => {
    getPhotoInfo.mockRejectedValueOnce("Dab fat error");

    const res = await makePhotoInfo(data as any);

    expect(res.isDone).toEqual(true);
    expect(res.value).toEqual({
      error: "Dab fat error",
      reqInfo: { photoFile: { path: "/super-path/to/" } },
    });
  });
});

describe("makeBase64_", () => {
  const makeBase64String = jest.fn((pathToPhoto: string, isInverted: boolean) =>
    Promise.resolve("base64-damned-string")
  );

  const data = {
    reqInfo: {
      photoFile: {
        path: "/super-path/to/",
      },
    },
    photoInfo: {
      isInverted: true,
    },
  };

  const makeBase64 = makeBase64_(makeBase64String as any);

  test("If all okey we populate data with base64 string", async () => {
    const res = await makeBase64(data as any);

    expect(makeBase64String).toHaveBeenCalledTimes(1);
    expect(makeBase64String).toHaveBeenNthCalledWith(
      1,
      "/super-path/to/",
      true
    );

    expect(res.isDone).toEqual(false);
    expect(res.value).toEqual({
      base64String: "base64-damned-string",
      photoInfo: { isInverted: true },
      reqInfo: { photoFile: { path: "/super-path/to/" } },
    });
  });

  test("If we got error we populate data with error and return Done", async () => {
    makeBase64String.mockRejectedValueOnce("Dab fat error");

    const res = await makeBase64(data as any);

    expect(res.isDone).toEqual(true);
    expect(res.value).toEqual({
      error: "Dab fat error",
      photoInfo: { isInverted: true },
      reqInfo: { photoFile: { path: "/super-path/to/" } },
    });
  });
});

describe("makeOptimizedPhotosAndSaveToWeb_", () => {
  // format, size, width, height
  const makeOptimizedPhotos = jest.fn((props: any) =>
    Promise.resolve({
      optimizedImageInfo: [
        { format: "webp", size: 10, width: 400, height: 400 },
        { format: "webp", size: 20, width: 800, height: 800 },
      ],
      optimizedPhotosPaths: new Map([
        [400, "/path/h-400.webp"],
        [800, "/path/h-800.webp"],
      ]),
    })
  );

  const uploadPhotos = jest.fn(() => Promise.resolve("webImagesInfo"));

  const data = {
    /* optimizedPhotosPaths: new Map([
      [400, "/path/h-400.webp"],
      [800, "/path/h-800.webp"],
    ]), */
    reqInfo: {
      photoFile: {
        path: "/super-path/to/",
        filename: "puppi.jpeg",
      },
    },
    photoInfo: {
      isInverted: true,
      width: 1200,
      height: 1200,
    },
  };

  const makeOptimizedPhotosAndSaveToWeb = makeOptimizedPhotosAndSaveToWeb_(
    makeOptimizedPhotos as any,
    uploadPhotos as any
  );

  test("If all okey we populate data with optimizedImageInfo and then with webImagesInfo", async () => {
    const res = await makeOptimizedPhotosAndSaveToWeb(data as any);

    expect(makeOptimizedPhotos).toHaveBeenCalledTimes(1);
    expect(makeOptimizedPhotos).toHaveBeenNthCalledWith(1, {
      currentPhotoSize: { height: 1200, width: 1200 },
      isInverted: true,
      pathToOriginalImage: "/super-path/to/",
      photoFileName: "puppi.jpeg",
    });

    expect(uploadPhotos).toHaveBeenCalledTimes(1);
    //expect(uploadPhotos).toHaveBeenNthCalledWith(1, ["/path/h-400.webp", "/path/h-800.webp"], Map {400 => "/path/h-400.webp", 800 => "/path/h-800.webp"});

    expect(res.isDone).toEqual(false);
    expect(res.value.optimizedImageInfo).toEqual([
      { format: "webp", height: 400, size: 10, width: 400 },
      { format: "webp", height: 800, size: 20, width: 800 },
    ]);
    expect(res.value.webImagesInfo).toEqual("webImagesInfo");
    expect(res.value.webImagesInfo).toEqual("webImagesInfo");
  });

  test("If we got error we populate data with error and return Done", async () => {
    uploadPhotos.mockRejectedValueOnce("Dab fat error");

    const res = await makeOptimizedPhotosAndSaveToWeb(data as any);

    expect(res.isDone).toEqual(true);
    expect(res.value.optimizedImageInfo).toEqual(undefined);
    expect(res.value.error).toEqual("Dab fat error");
  });
});
