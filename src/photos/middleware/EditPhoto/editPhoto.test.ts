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
import { editPhotoMiddleware as editPhotoMiddleware_ } from "./editPhoto";

const checkFirestoreRecordOnEditAndCollectWebIds = jest.fn(() =>
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
const makePhotoDataAndSendToDbOnEdit = jest.fn(() =>
  Promise.resolve(NI_Next.of("AddPhotoData_5"))
);
const updatePhotoOnOriginalPhotoStorage = jest.fn(() => Promise.resolve());
const updatePhotoOnOriginalPhotoStorage_ = jest.fn(
  () => updatePhotoOnOriginalPhotoStorage
);

const onSuccessResponseOnEdit = jest.fn(() => () => {});
const onSuccessResponseOnEdit_ = jest.fn(() => onSuccessResponseOnEdit);
const onErrorResponse = jest.fn(() => () => {});
const onErrorResponse_ = jest.fn(() => onErrorResponse);

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

const res = {};

const logger = {
  log: jest.fn(),
};

describe("editPhoto", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  const editPhotoMiddleware = editPhotoMiddleware_(
    checkFirestoreRecordOnEditAndCollectWebIds,
    makePhotoInfoAndPathsToOptimizedPhotos as any,
    makeOptimizedPhotosAndBase64String,
    uploadPhotosToPhotosWebStorage,
    makePhotoDataAndSendToDbOnEdit,
    updatePhotoOnOriginalPhotoStorage_,
    onErrorResponse_,
    onSuccessResponseOnEdit_
  );

  test("If we do not have photo file we do nothing", async () => {
    let anotherReq = {
      file: undefined,
      body: undefined,
    };

    await editPhotoMiddleware(logger as any)(
      anotherReq as any,
      res as any,
      {} as any
    );

    expect(checkFirestoreRecordOnEditAndCollectWebIds).toHaveBeenCalledTimes(0);
    expect(makePhotoInfoAndPathsToOptimizedPhotos).toHaveBeenCalledTimes(0);
    expect(makeOptimizedPhotosAndBase64String).toHaveBeenCalledTimes(0);
    expect(uploadPhotosToPhotosWebStorage).toHaveBeenCalledTimes(0);
    expect(makePhotoDataAndSendToDbOnEdit).toHaveBeenCalledTimes(0);
    expect(updatePhotoOnOriginalPhotoStorage).toHaveBeenCalledTimes(0);
    expect(onErrorResponse).toHaveBeenCalledTimes(1);
    expect(onSuccessResponseOnEdit).toHaveBeenCalledTimes(0);
  });

  test("If all okey", async () => {
    await editPhotoMiddleware(logger as any)(req as any, res as any, {} as any);

    expect(checkFirestoreRecordOnEditAndCollectWebIds).toHaveBeenCalledTimes(1);
    expect(makePhotoInfoAndPathsToOptimizedPhotos).toHaveBeenCalledTimes(1);
    expect(makeOptimizedPhotosAndBase64String).toHaveBeenCalledTimes(1);
    expect(uploadPhotosToPhotosWebStorage).toHaveBeenCalledTimes(1);
    expect(makePhotoDataAndSendToDbOnEdit).toHaveBeenCalledTimes(1);
    expect(updatePhotoOnOriginalPhotoStorage).toHaveBeenCalledTimes(1);
    expect(onErrorResponse).toHaveBeenCalledTimes(0);
    expect(onSuccessResponseOnEdit).toHaveBeenCalledTimes(1);
  });
});
