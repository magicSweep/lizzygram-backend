import wait from "waait";
import {
  checkFirestoreRecordOnAdd_,
  checkFirestoreRecordOnEditAndCollectWebIds_,
  makePhotoInfoAndPathsToOptimizedPhotos_,
  makeOptimizedPhotosAndBase64String_,
  uploadPhotosToPhotosWebStorage_,
  makePhotoDataAndSendToDbOnAdd_,
  makePhotoDataAndSendToDbOnEdit_,
  savePhotoToOriginalPhotoStorage_,
  updatePhotoOnOriginalPhotoStorage_,
  onErrorResponse_,
  onSuccessResponseOnEdit_,
  onSuccessResponseOnAdd_,
} from "./Photos.controller";

// @ts-ignore
global.console = {
  error: jest.fn(),
};

const logger = {
  log: jest.fn(),
};

const json = jest.fn(() => ({
  end: () => {},
}));

const response = {
  status: () => ({
    json,
  }),
};

describe("checkFirestoreRecordOnAdd_ - return Next on success, Done - if not valid or error", () => {
  const getPhoto = jest.fn(() => Promise.resolve("photo"));
  const isValidPhotoDbRecordOnAdd = jest.fn();

  const reqInfo = {
    photoId: "photoId",
    userUid: "userUid",
  };

  const checkFirestoreRecordOnAdd = checkFirestoreRecordOnAdd_(
    getPhoto as any,
    isValidPhotoDbRecordOnAdd
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("We got error on firestore request - we add error to our data", async () => {
    getPhoto.mockRejectedValueOnce("Boom");

    const res = await checkFirestoreRecordOnAdd({
      reqInfo: { ...reqInfo },
    } as any);

    expect(res._value).toEqual({
      reqInfo: { photoId: "photoId", userUid: "userUid" },
      error: "Boom",
    });
  });

  test("Photo not valid - we add error to our data", async () => {
    isValidPhotoDbRecordOnAdd.mockReturnValueOnce(
      "Not valid for some reason..."
    );

    const res = await checkFirestoreRecordOnAdd({
      reqInfo: { ...reqInfo },
    } as any);

    expect(res._value).toEqual({
      reqInfo: { photoId: "photoId", userUid: "userUid" },
      error: "Not valid for some reason...",
    });
  });

  test("All okey", async () => {
    isValidPhotoDbRecordOnAdd.mockReturnValueOnce(true);

    const res = await checkFirestoreRecordOnAdd({
      reqInfo: { ...reqInfo },
    } as any);

    expect(res._value).toEqual({
      reqInfo: { photoId: "photoId", userUid: "userUid" },
    });
  });
});

describe("checkFirestoreRecordOnEditAndCollectWebIds_", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const reqInfo = {
    photoId: "photoId",
    userUid: "userUid",
  };

  const getPhoto = jest.fn(() =>
    Promise.resolve({
      files: "files",
      googleDriveId: "googleDriveId",
    })
  );
  const isValidPhotoDbRecordOnEdit = jest.fn();

  const checkFirestoreRecordOnEditAndCollectWebIds =
    checkFirestoreRecordOnEditAndCollectWebIds_(
      getPhoto as any,
      isValidPhotoDbRecordOnEdit
    );

  test("We got error on firestore request - we add error to our data", async () => {
    getPhoto.mockRejectedValueOnce("Boom");

    const res = await checkFirestoreRecordOnEditAndCollectWebIds({
      reqInfo: { ...reqInfo },
    } as any);

    expect(res._value).toEqual({
      reqInfo: { photoId: "photoId", userUid: "userUid" },
      error: "Boom",
    });
  });

  test("Photo not valid - we add error to our data", async () => {
    isValidPhotoDbRecordOnEdit.mockReturnValueOnce(
      "Not valid for some reason..."
    );

    const res = await checkFirestoreRecordOnEditAndCollectWebIds({
      reqInfo: { ...reqInfo },
    } as any);

    expect(res._value).toEqual({
      reqInfo: { photoId: "photoId", userUid: "userUid" },
      error: "Not valid for some reason...",
    });
  });

  test("All okey - we add googleDriveId and files info from photo to our data", async () => {
    isValidPhotoDbRecordOnEdit.mockReturnValueOnce(true);

    const res = await checkFirestoreRecordOnEditAndCollectWebIds({
      reqInfo: { ...reqInfo },
    } as any);

    expect(res._value).toEqual({
      prevGoogleDriveId: "googleDriveId",
      prevWebImagesIds: "files",
      reqInfo: { photoId: "photoId", userUid: "userUid" },
    });
  });
});

describe("makePhotoInfoAndPathsToOptimizedPhotos_", () => {
  const photoFile = {
    filename: "photo-name",
    path: "/path",
  };

  const getPhotoInfo = jest.fn(() => Promise.resolve("photo-info"));
  const makePaths = jest.fn(() => "optimized path");

  const makePhotoInfoAndPathsToOptimizedPhotos =
    makePhotoInfoAndPathsToOptimizedPhotos_(
      getPhotoInfo as any,
      makePaths as any
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If some error - we add error info to our data", async () => {
    getPhotoInfo.mockRejectedValueOnce("Boooom!!!!");

    let res = await makePhotoInfoAndPathsToOptimizedPhotos({
      reqInfo: {
        photoFile: { ...photoFile },
      },
    } as any);

    expect(res._value).toEqual({
      reqInfo: { photoFile: { filename: "photo-name", path: "/path" } },

      error: "Boooom!!!!",
    });

    makePaths.mockImplementationOnce(() => {
      throw new Error("What error...");
    });

    res = await makePhotoInfoAndPathsToOptimizedPhotos({
      reqInfo: {
        photoFile: { ...photoFile },
      },
    } as any);

    expect(res._value.error.toString()).toEqual("Error: What error...");
  });

  test("All okey - we add photoInfo and optimizedPhotosPaths to our data", async () => {
    let res = await makePhotoInfoAndPathsToOptimizedPhotos({
      reqInfo: {
        photoFile: { ...photoFile },
      },
    } as any);

    expect(res._value).toEqual({
      optimizedPhotosPaths: "optimized path",
      photoInfo: "photo-info",
      reqInfo: { photoFile: { filename: "photo-name", path: "/path" } },
    });
  });
});

describe("makeOptimizedPhotosAndBase64String_", () => {
  const makeOptimizedByWidthPhotoFiles = jest.fn(() =>
    Promise.resolve("optimizedImageInfo")
  );
  const makeBase64String = jest.fn(() => Promise.resolve("base64String"));
  const photoSizes = "photoSizes";

  const makeOptimizedPhotosAndBase64String =
    makeOptimizedPhotosAndBase64String_(
      makeOptimizedByWidthPhotoFiles as any,
      makeBase64String,
      photoSizes as any
    );

  const photoInfo = {
    width: 100,
    height: 100,
    isInverted: false,
  };

  const photoFile = {
    path: "/path",
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("On error we populate data with error msg", async () => {
    makeBase64String.mockRejectedValueOnce("Bad fat error....");

    const res = await makeOptimizedPhotosAndBase64String({
      reqInfo: {
        photoFile: { ...photoFile },
      },
      photoInfo: { ...photoInfo },
    } as any);

    expect(res._value).toEqual({
      photoInfo: { height: 100, isInverted: false, width: 100 },
      reqInfo: { photoFile: { path: "/path" } },
      error: "Bad fat error....",
    });
  });

  test("All okey - we add optimizedImageInfo, base64String to our data...", async () => {
    const res = await makeOptimizedPhotosAndBase64String({
      reqInfo: {
        photoFile: { ...photoFile },
      },
      photoInfo: { ...photoInfo },
    } as any);

    expect(res._value).toEqual({
      base64String: "base64String",
      optimizedImageInfo: "optimizedImageInfo",
      photoInfo: { height: 100, isInverted: false, width: 100 },
      reqInfo: { photoFile: { path: "/path" } },
    });
  });
});

describe("uploadPhotosToPhotosWebStorage_", () => {
  const uploadPhotos = jest.fn(() => Promise.resolve("upload-info"));
  const makeWebImagesInfo = jest.fn(() => "webImagesInfo");

  const optimizedPhotosPaths = {
    values: () => "optimizedPhotosPaths--values",
  };

  const uploadPhotosToPhotosWebStorage = uploadPhotosToPhotosWebStorage_(
    uploadPhotos as any,
    makeWebImagesInfo as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("On error we populate data with error msg", async () => {
    uploadPhotos.mockRejectedValueOnce("Fuuuuuuuuu...");

    const res = await uploadPhotosToPhotosWebStorage({
      optimizedPhotosPaths: { ...optimizedPhotosPaths },
    } as any);

    expect(res._value.optimizedPhotosPaths).toEqual(optimizedPhotosPaths);
    expect(res._value.error).toEqual("Fuuuuuuuuu...");
  });

  test("All okey - we upload photos and then add webImagesInfo to our data...", async () => {
    const res = await uploadPhotosToPhotosWebStorage({
      optimizedPhotosPaths: { ...optimizedPhotosPaths },
    } as any);

    expect(res._value.optimizedPhotosPaths).toEqual(optimizedPhotosPaths);
    expect(res._value.webImagesInfo).toEqual("webImagesInfo");
  });
});

describe("makePhotoDataAndSendToDbOnAdd_", () => {
  const makePhotoFieldsToUpdateOnAdd = jest.fn(() => "fieldsToUpdate");
  const updatePhoto = jest.fn(() => Promise.resolve("boom"));

  const reqInfo = {
    photoId: "photoId",
  };

  const makePhotoDataAndSendToDbOnAdd = makePhotoDataAndSendToDbOnAdd_(
    makePhotoFieldsToUpdateOnAdd as any,
    updatePhoto as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("On error we populate data with error msg", async () => {
    updatePhoto.mockRejectedValueOnce("Aaaaaaaaaaaaaa...");

    const res = await makePhotoDataAndSendToDbOnAdd({
      reqInfo: {
        ...reqInfo,
      },
    } as any);

    expect(res._value).toEqual({
      error: "Aaaaaaaaaaaaaa...",
      reqInfo: { photoId: "photoId" },
    });
  });

  test("All okey - we return data.", async () => {
    const res = await makePhotoDataAndSendToDbOnAdd({
      reqInfo: {
        ...reqInfo,
      },
    } as any);

    expect(res._value).toEqual({ reqInfo: { photoId: "photoId" } });
  });
});

describe("makePhotoDataAndSendToDbOnEdit_", () => {
  const makePhotoFieldsToUpdateOnEdit = jest.fn(() => "fieldsToUpdate");
  const updatePhoto = jest.fn(() => Promise.resolve("boom"));

  const reqInfo = {
    photoId: "photoId",
  };

  const makePhotoDataAndSendToDbOnEdit = makePhotoDataAndSendToDbOnEdit_(
    makePhotoFieldsToUpdateOnEdit as any,
    updatePhoto as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("On error we populate data with error msg", async () => {
    updatePhoto.mockRejectedValueOnce("Aaaaaaaaaaaaaa...");

    const res = await makePhotoDataAndSendToDbOnEdit({
      reqInfo: {
        ...reqInfo,
      },
    } as any);

    expect(res._value).toEqual({
      error: "Aaaaaaaaaaaaaa...",
      reqInfo: { photoId: "photoId" },
    });
  });

  test("All okey - we return data.", async () => {
    const res = await makePhotoDataAndSendToDbOnEdit({
      reqInfo: {
        ...reqInfo,
      },
    } as any);

    expect(res._value).toEqual({ reqInfo: { photoId: "photoId" } });
  });
});

describe("savePhotoToOriginalPhotoStorage_", () => {
  const saveToGoogleDrive = jest.fn(() => Promise.resolve({ id: "id123" }));
  const updatePhoto = jest.fn(() => Promise.resolve());
  const removePhoto = jest.fn();

  //data.reqInfo.photoFile.filename
  const photoFile = {
    originalname: "blue-123.jpg",
    filename: "filename",
    path: "/path",
  };

  const reqInfo = {
    photoId: "photoId",
    photoFile,
  };

  const savePhotoToOriginalPhotoStorage = savePhotoToOriginalPhotoStorage_(
    saveToGoogleDrive as any,
    updatePhoto as any,
    removePhoto
  )(logger as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If we get error on add to google drive or on update firestore record - we only notice about error and do nothing", async () => {
    saveToGoogleDrive.mockRejectedValueOnce("GOOOOOOOOO");

    await savePhotoToOriginalPhotoStorage({
      reqInfo: { ...reqInfo },
    } as any);

    await wait(100);

    expect(removePhoto).toHaveBeenCalledTimes(0);
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenNthCalledWith(
      1,
      "error",
      "Error on save photo to google drive",
      {
        error: "GOOOOOOOOO",
        photoFile: {
          filename: "filename",
          originalname: "blue-123.jpg",
          path: "/path",
        },
      }
    );
  });

  test("If all okey - we remove original photo", async () => {
    await savePhotoToOriginalPhotoStorage({
      reqInfo: { ...reqInfo },
    } as any);

    await wait(100);

    expect(saveToGoogleDrive).toHaveBeenCalledTimes(1);
    expect(updatePhoto).toHaveBeenCalledTimes(1);

    expect(removePhoto).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledTimes(0);
  });
});

describe("updatePhotoOnOriginalPhotoStorage_", () => {
  const saveToGoogleDrive = jest.fn(() => Promise.resolve({ id: "id123" }));
  const updateOnGoogleDrive = jest.fn(() => Promise.resolve({ id: "id123" }));
  const updatePhoto = jest.fn(() => Promise.resolve());
  const isExists = jest.fn(() => Promise.resolve(true));
  const removePhoto = jest.fn();

  //data.reqInfo.photoFile.filename
  const photoFile = {
    originalname: "blue-123.jpg",
    filename: "filename",
    path: "/path",
  };

  const reqInfo = {
    photoId: "photoId",
    photoFile,
  };

  const updatePhotoOnOriginalPhotoStorage = updatePhotoOnOriginalPhotoStorage_(
    updateOnGoogleDrive as any,
    saveToGoogleDrive as any,
    updatePhoto as any,
    removePhoto as any,
    isExists as any
  )(logger as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If we get error on add to google drive or on update firestore record - we only notice about error and do nothing", async () => {
    updatePhoto.mockRejectedValueOnce("GOOOOOOOOO");

    await updatePhotoOnOriginalPhotoStorage({
      reqInfo: { ...reqInfo },
    } as any);

    await wait(100);

    expect(removePhoto).toHaveBeenCalledTimes(0);
    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenNthCalledWith(
      1,
      "error",
      "Error on update photo on google drive",
      {
        error: "GOOOOOOOOO",
        photoFile: {
          filename: "filename",
          originalname: "blue-123.jpg",
          path: "/path",
        },
      }
    );
  });

  test("If all okey - we remove original photo", async () => {
    await updatePhotoOnOriginalPhotoStorage({
      reqInfo: { ...reqInfo },
    } as any);

    await wait(100);

    expect(updateOnGoogleDrive).toHaveBeenCalledTimes(1);
    expect(saveToGoogleDrive).toHaveBeenCalledTimes(0);
    expect(updatePhoto).toHaveBeenCalledTimes(1);

    expect(removePhoto).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenCalledTimes(0);
  });
});

describe("onErrorResponse_", () => {
  const removePhoto = jest.fn();
  const removePhotos = jest.fn();
  const removePhotosFromWebStore = jest.fn();

  const photoFile = {
    originalname: "blue-123.jpg",
    filename: "filename",
    path: "/path",
  };

  const reqInfo = {
    photoId: "photoId",
    photoFile,
  };

  const webImagesInfo = {
    ids: "web-images-ids",
  };

  const optimizedPhotosPaths = {
    values: () => [1, 2],
  };

  const onErrorResponse = onErrorResponse_(
    removePhoto,
    removePhotos,
    removePhotosFromWebStore
  )(response as any, logger as any, true);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test(`What we do:
    - we log error
    - if in request we have file - we remove it
    - if optimezed photos was created - we remove them
    - if we upload photos to cloudinary - we remove them
    - we send response with html status 200-ok and our status error
  `, () => {
    onErrorResponse({
      optimizedPhotosPaths,
      webImagesInfo,
      reqInfo,
    } as any);

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(removePhoto).toHaveBeenCalledTimes(1);
    expect(removePhotos).toHaveBeenCalledTimes(1);
    expect(removePhotosFromWebStore).toHaveBeenCalledTimes(1);

    expect(json).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenNthCalledWith(1, { data: {}, status: "error" });
  });
});

describe("onSuccessResponseOnAdd_", () => {
  const removePhoto = jest.fn();

  const optimizedPhotosPaths = {
    values: () => [1, 2],
  };

  const onSuccessResponseOnAdd = onSuccessResponseOnAdd_(removePhoto)(
    response as any,
    logger as any
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("We remove temp optimezed photos, log and send response", () => {
    onSuccessResponseOnAdd({
      optimizedPhotosPaths,
    } as any);

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(removePhoto).toHaveBeenCalledTimes(1);

    expect(json).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenNthCalledWith(1, { data: {}, status: "success" });
  });
});

describe("onSuccessResponseOnEdit_", () => {
  const removePhoto = jest.fn();
  const removePhotosFromWebStore = jest.fn();

  const optimizedPhotosPaths = {
    values: () => [1, 2],
  };

  const onSuccessResponseOnEdit = onSuccessResponseOnEdit_(
    removePhoto,
    removePhotosFromWebStore
  )(response as any, logger as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("We remove temp optimezed photos, log and send response", () => {
    onSuccessResponseOnEdit({
      optimizedPhotosPaths,
      prevWebImagesIds: "prevWebImagesIds",
    } as any);

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(removePhoto).toHaveBeenCalledTimes(1);
    expect(removePhotosFromWebStore).toHaveBeenCalledTimes(1);
    expect(removePhotosFromWebStore).toHaveBeenNthCalledWith(
      1,
      "prevWebImagesIds"
    );

    expect(json).toHaveBeenCalledTimes(1);
    expect(json).toHaveBeenNthCalledWith(1, { data: {}, status: "success" });
  });
});
