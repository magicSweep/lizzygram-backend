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
import { addPhotoMiddleware as addPhotoMiddleware_ } from "./addPhoto";

const checkFirestoreRecordOnAdd = jest.fn(() =>
  Promise.resolve(NI_Next.of("AddPhotoData_1"))
);
const makeOptimizedPhotosAndBase64String = jest.fn(() =>
  Promise.resolve(NI_Next.of("AddPhotoData_2"))
);
const makePhotoInfoAndPathsToOptimizedPhotos = jest.fn(() =>
  Promise.resolve(NI_Next.of("AddPhotoData_3"))
);
const uploadPhotosToPhotosWebStorage = jest.fn(() =>
  Promise.resolve(NI_Next.of("AddPhotoData_4"))
);
const makePhotoDataAndSendToDbOnAdd = jest.fn(() =>
  Promise.resolve(NI_Next.of("AddPhotoData_5"))
);
const savePhotoToOriginalPhotoStorage = jest.fn(() => Promise.resolve());
const savePhotoToOriginalPhotoStorage_ = jest.fn(
  () => savePhotoToOriginalPhotoStorage
);

const onSuccessResponseOnAdd = jest.fn(() => () => {});
const onSuccessResponseOnAdd_ = jest.fn(() => onSuccessResponseOnAdd);

const onErrorResponse = jest.fn(() => () => {});
const onErrorResponse_ = jest.fn(() => onErrorResponse);

let req = {
  file: "file",
  body: {
    photoId: "photoId",
    userUid: "userUid",
  },
};

const logger = {
  log: jest.fn(),
};

/* const json = jest.fn(() => ({
  end: () => {},
}));

const res = {
  status: () => ({
    json,
  }),
}; */

const res = {};

describe("addPhotoMiddleware", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const addPhotoMiddleware = addPhotoMiddleware_(
    checkFirestoreRecordOnAdd,
    makePhotoInfoAndPathsToOptimizedPhotos,
    makeOptimizedPhotosAndBase64String,
    uploadPhotosToPhotosWebStorage,
    makePhotoDataAndSendToDbOnAdd,
    savePhotoToOriginalPhotoStorage_,
    onErrorResponse_,
    onSuccessResponseOnAdd_
  );

  test("If we do not have photo file we do nothing", async () => {
    let anotherReq = {
      file: undefined,
      body: undefined,
    };

    await addPhotoMiddleware(logger as any)(
      anotherReq as any,
      res as any,
      {} as any
    );

    expect(checkFirestoreRecordOnAdd).toHaveBeenCalledTimes(0);

    //expect(logger.log).toHaveBeenCalledTimes(0);

    expect(makePhotoInfoAndPathsToOptimizedPhotos).toHaveBeenCalledTimes(0);
    expect(makeOptimizedPhotosAndBase64String).toHaveBeenCalledTimes(0);
    expect(uploadPhotosToPhotosWebStorage).toHaveBeenCalledTimes(0);
    expect(makePhotoDataAndSendToDbOnAdd).toHaveBeenCalledTimes(0);
    expect(savePhotoToOriginalPhotoStorage).toHaveBeenCalledTimes(0);

    expect(onSuccessResponseOnAdd).toHaveBeenCalledTimes(0);
    expect(onErrorResponse).toHaveBeenCalledTimes(1);
  });

  test("If all okey", async () => {
    await addPhotoMiddleware(logger as any)(req as any, res as any, {} as any);

    expect(checkFirestoreRecordOnAdd).toHaveBeenCalledTimes(1);

    //expect(logger.log).toHaveBeenCalledTimes(0);

    expect(makePhotoInfoAndPathsToOptimizedPhotos).toHaveBeenCalledTimes(1);
    expect(makeOptimizedPhotosAndBase64String).toHaveBeenCalledTimes(1);
    expect(uploadPhotosToPhotosWebStorage).toHaveBeenCalledTimes(1);
    expect(makePhotoDataAndSendToDbOnAdd).toHaveBeenCalledTimes(1);
    expect(savePhotoToOriginalPhotoStorage).toHaveBeenCalledTimes(1);

    expect(onSuccessResponseOnAdd).toHaveBeenCalledTimes(1);
    expect(onErrorResponse).toHaveBeenCalledTimes(0);
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
