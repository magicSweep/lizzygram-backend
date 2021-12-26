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
import { addPhotoMiddleware } from ".";
import { isValidPhotoDbRecordOnAdd } from "../../service/Validator";
import { getPhoto, updatePhoto } from "../../service/PhotosDb";
import { removePhoto, removePhotos } from "../../service/Fs";
import { save as saveToGoogleDrive } from "../../service/OriginalPhotoStore";
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

/* jest.mock("../../service/PhotosWebStore", () => ({
  __esModule: true,
  removePhotos: jest.fn(),
  uploadPhotos: jest.fn().mockResolvedValue("photoImagesInfo[]"),
  makeWebImagesInfo: jest.fn().mockResolvedValue({
    ids: ["id-1", "id-2"],
    urls: new Map([
      [800, "https://v.ru/800"],
      [1280, "https://v.ru/1280"],
    ]),
  }),
})); */

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
  isActive: false,
  addedByUserUID: "userUID",
  files: ["file1", "file2"],
  googleDriveId: "googleDriveId",
});

describe("addPhotoMiddleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If we do not have photo file we do nothing", async () => {
    let anotherReq = {
      file: undefined,
      body: undefined,
    };

    let result: any = await addPhotoMiddleware(
      anotherReq as any,
      res as any,
      {} as any
    );

    expect(makeBase64String).toHaveBeenCalledTimes(0);

    expect(removePhoto).toHaveBeenCalledTimes(0);

    expect(result).toEqual({ data: {}, status: "error" });
  });

  test("Firestore record not valid or some error on firestore - we remove upload photo", async () => {
    (isValidPhotoDbRecordOnAdd as jest.Mock).mockReturnValueOnce(
      "No firebase record"
    );

    let result: any = await addPhotoMiddleware(
      req as any,
      res as any,
      {} as any
    );

    expect(result).toEqual({ data: {}, status: "error" });

    expect(getPhoto).toHaveBeenCalledTimes(1);

    expect(removePhoto).toHaveBeenCalledTimes(1);

    expect(isValidPhotoDbRecordOnAdd).toHaveBeenCalledTimes(1);

    expect(isValidPhotoDbRecordOnAdd).toHaveBeenNthCalledWith(
      1,
      "photoId",
      {
        addedByUserUID: "userUID",
        files: ["file1", "file2"],
        googleDriveId: "googleDriveId",
        id: "photo_id",
        isActive: false,
        src: "src",
      },
      "userUid"
    );

    (getPhoto as jest.Mock).mockRejectedValueOnce("Some firestore error");

    await addPhotoMiddleware(req as any, res as any, {} as any);

    expect(result).toEqual({ data: {}, status: "error" });

    expect(getPhoto).toHaveBeenCalledTimes(2);

    expect(removePhoto).toHaveBeenCalledTimes(2);

    expect(isValidPhotoDbRecordOnAdd).toHaveBeenCalledTimes(1);
  });

  test("Error on makePaths - not async operation", async () => {
    (makePaths as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Bad fat error");
    });

    (getPhoto as jest.Mock).mockResolvedValueOnce("photo");

    let result: any = await addPhotoMiddleware(
      req as any,
      res as any,
      {} as any
    );

    expect(result).toEqual({ data: {}, status: "error" });
  });

  test("If all okey", async () => {
    let result: any = await addPhotoMiddleware(
      req as any,
      res as any,
      {} as any
    );

    await wait(100);

    expect(getPhoto).toHaveBeenCalledTimes(1);

    expect(isValidPhotoDbRecordOnAdd).toHaveBeenCalledTimes(1);

    expect(makeBase64String).toHaveBeenCalledTimes(1);
    expect(uploadPhotos).toHaveBeenCalledTimes(1);
    expect(makeWebImagesInfo).toHaveBeenCalledTimes(1);

    //expect(makePhotoFieldsToUpdateOnAdd).toHaveBeenCalledTimes(1);

    expect(updatePhoto).toHaveBeenCalledTimes(2);

    expect(saveToGoogleDrive).toHaveBeenCalledTimes(1);

    expect(removePhoto).toHaveBeenCalledTimes(1);
    expect(removePhotos).toHaveBeenCalledTimes(1);

    expect(result).toEqual({ data: {}, status: "success" });
  });
});

test("", () => {
  const func = (): { hello: string } | undefined => {
    return {
      hello: "bye",
    };
  };

  const b = func();

  const t = b?.hello;

  expect(t).toEqual("bye");
});

/////// PROMISES TESTS

const tryCatch = (_try: any, _catch: any) => (val: any) => {
  try {
    return _try(val);
  } catch (err) {
    return _catch(err);
  }
};

const tryCatchAsync = (_try: any, _catch: any) => async (val: any) => {
  try {
    return await _try(val);
  } catch (err) {
    return _catch(err);
  }
};

test.skip("tryCatchAsync", async () => {
  const res = await tryCatchAsync(
    (str: any) => {
      if (str === "bad") throw new Error("It is very bad");

      return Promise.resolve(`--${str}--`);
    },
    (err: any) => {
      return `[CATCH ERROR] ${err.message}`;
    }
  )("bad");

  expect(res).toEqual("h");
});

test.skip("tryCatch", async () => {
  const res = tryCatch(
    (str: any) => {
      if (str === "bad") throw new Error("It is very bad");

      return `--${str}--`;
    },
    (err: any) => {
      throw err;
      //return `[CATCH ERROR] ${err.message}`;
    }
  )("bad");

  expect(res).toEqual("h");
});

test.skip("Test promises behaviour #1", async () => {
  const func = async () => Promise.resolve({ hello: 12, bye: 33 });

  const f = async () => ({
    goog: "blue",
    ...(await func()),
  });

  const res = await f();

  expect(res).toEqual("hello");
});

test.skip("Test promises behaviour #2", async () => {
  const func = compose(
    async () => {
      return Promise.resolve("hello");
    },
    then((res: string) => res.toUpperCase()),
    then(
      tap(
        compose(
          async (res: string) => {
            return Promise.resolve(res + "-bye");
          },
          then((res: string) => res.toLowerCase()),
          then(async (res: string) => {
            return Promise.resolve(res + "-123");
          }),
          then((res: any) => console.log("RESULT----------", res))
        )
      )
    ),
    then(
      compose(
        async (res: string) => {
          return Promise.resolve(res + "-iop");
        },
        then((res: string) => res.toUpperCase())
      )
    )
  );

  const res = await func();

  expect(res).toEqual("h");
});

/* describe("addPhotoMiddleware", () => {
  test("", async () => {
    const asyncFunc = async (cond: boolean) => {
      if (cond === false) return Promise.reject("Promise failed");

      return Promise.resolve("hello");
    };

    const func = compose<boolean, Promise<any>>(
      NI_Next.of,
      chain(
        compose(
          asyncFunc,
          then((str: string) => NI_Next.of(str)),
          _catch((err: any) => Done.of(`[GOT ERROR] - ${err}`))
        )
      ),
      then(map((str: string) => str.toUpperCase())),
      then(
        chain(
          compose(
            asyncFunc,
            then((str: string) => NI_Next.of(str)),
            _catch((err: any) => Done.of(`[GOT ANOTHER ERROR] - ${err}`))
          )
        )
      ),
      _catch((err: any) => err),
      then(map((str: string) => `--- ${str} ---`)),
      _catch((err: any) => err)
    );

    let res = await func(true);

    expect(res).toEqual("hello");
  });
}); */
