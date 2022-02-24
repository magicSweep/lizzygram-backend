import { downloadPhotoMiddleware_ } from "./downloadPhoto";

const end = jest.fn();

const json = jest.fn(() => ({
  end,
}));

const res = {
  write: jest.fn(),
  setHeader: jest.fn(),
  type: jest.fn(),
  status: () => {
    return {
      json,
    };
  },
};

const log = jest.fn();

const logger = {
  log,
};

const photoStream: any = {
  on: jest.fn(() => photoStream),
};

const downloadImageStream = jest.fn(() => Promise.resolve(photoStream));

describe("downloadPhotoMiddleware", () => {
  const req = {
    params: {
      photoQuery: "",
    },
  };
  const next = jest.fn();

  const isValidPhotoQuery = jest.fn();

  const userExists = jest.fn();

  const downloadPhotoMiddleware = downloadPhotoMiddleware_(
    isValidPhotoQuery,
    userExists,
    downloadImageStream
  );

  test("If all okey we create stream from google drive to client", async () => {
    req.params.photoQuery = "super-photo.jpeg";

    isValidPhotoQuery.mockReturnValueOnce(true);

    userExists.mockResolvedValueOnce(true);

    await downloadPhotoMiddleware(logger as any)(req as any, res as any, next);

    expect(downloadImageStream).toHaveBeenCalledTimes(1);
    expect(photoStream.on).toHaveBeenCalledTimes(3);
  });

  describe("Validation", () => {
    afterEach(() => {
      jest.clearAllMocks();
    });

    /*  test("We got no extension in our photo request param", async () => {
      req.params.photoQuery = "hello";

      await downloadPhotoMiddleware(logger as any)(
        req as any,
        res as any,
        next
      );

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({ data: {}, status: "error" });

      expect(log).toHaveBeenCalledWith("error", "DOWNLOAD PHOTO ERROR", {
        INFO: {
          photoQuery: "hello",
          resultDebug: "We got wrong photo query format...",
          splittedPhotoQuery: ["hello"],
        },
      });
    }); */

    test("We got not valid photo query", async () => {
      req.params.photoQuery = "photoQuery";

      isValidPhotoQuery.mockReturnValueOnce("Some bad fat error...");

      await downloadPhotoMiddleware(logger as any)(
        req as any,
        res as any,
        next
      );

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({ data: {}, status: "error" });

      expect(log).toHaveBeenCalledWith("error", "DOWNLOAD PHOTO ERROR", {
        INFO: {
          photoQuery: "photoQuery",
          resultDebug: "Validation not pass...",
          validation: "Some bad fat error...",
        },
      });
    });

    test("User has no grants to download photo", async () => {
      req.params.photoQuery = "photoQuery";

      isValidPhotoQuery.mockReturnValueOnce(true);

      userExists.mockResolvedValueOnce(false);

      await downloadPhotoMiddleware(logger as any)(
        req as any,
        res as any,
        next
      );

      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({ data: {}, status: "error" });

      expect(log).toHaveBeenCalledWith("error", "DOWNLOAD PHOTO ERROR", {
        INFO: {
          //extension: "jpeg",
          googleDriveId: "",
          photoQuery: "photoQuery",
          resultDebug: "User does not have grants to download photo...",
          //splittedPhotoQuery: ["hello", "jpeg"],
          userExists: false,
          userUid: "photoQuery",
          validation: true,
        },
      });
    });
  });
});
