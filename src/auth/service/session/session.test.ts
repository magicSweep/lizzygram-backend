import { saveRole_, checkRole_, getInfoFromFile_ } from ".";

const readFile = jest.fn();
const writeFile = jest.fn();
const existsSync = jest.fn();

const logger = {
  log: jest.fn(),
};

const getInfoFromFile = getInfoFromFile_("/path.jpeg", readFile, existsSync);

const saveRole = saveRole_(
  "/path.jpeg",
  writeFile,
  getInfoFromFile
)(logger as any);

const checkRole = checkRole_(getInfoFromFile)(logger as any);

describe("Session storage service", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("saveRole", () => {
    let props = {
      userUid: "userUid",
      isEditor: true,
    };

    test("If session file not exists we only save our user info", async () => {
      existsSync.mockReturnValueOnce(false);
      writeFile.mockResolvedValueOnce(null);

      await saveRole({
        ...props,
      });

      expect(readFile).toHaveBeenCalledTimes(0);

      expect(existsSync).toHaveBeenCalledTimes(1);

      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenNthCalledWith(
        1,
        "/path.jpeg",
        '{"userUid":true}',
        { encoding: "utf-8" }
      );

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenNthCalledWith(
        1,
        "info",
        "SAVE ROLE TO SESSION",
        {
          data: {
            isEditor: true,
            storageData: { userUid: true },
            userUid: "userUid",
          },
        }
      );
    });

    test("If session file exists we get info from it, add our user info and and save", async () => {
      existsSync.mockReturnValueOnce(true);
      writeFile.mockResolvedValueOnce(null);

      readFile.mockResolvedValueOnce('{"otherUid":true}');

      await saveRole({
        ...props,
      });

      expect(existsSync).toHaveBeenCalledTimes(1);

      expect(readFile).toHaveBeenCalledTimes(1);
      expect(readFile).toHaveBeenNthCalledWith(1, "/path.jpeg", {
        encoding: "utf-8",
      });

      expect(writeFile).toHaveBeenCalledTimes(1);
      expect(writeFile).toHaveBeenNthCalledWith(
        1,
        "/path.jpeg",
        '{"otherUid":true,"userUid":true}',
        { encoding: "utf-8" }
      );

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenNthCalledWith(
        1,
        "info",
        "SAVE ROLE TO SESSION",
        {
          data: {
            isEditor: true,
            storageData: { otherUid: true, userUid: true },
            userUid: "userUid",
          },
        }
      );
    });
  });

  describe("checkRole", () => {
    let props = {
      userUid: "userUid",
    };

    test("If session file not exists we return null", async () => {
      existsSync.mockReturnValueOnce(false);
      //readFile.mockResolvedValueOnce(null);

      const res = await checkRole({
        ...props,
      });

      expect(res).toEqual(null);

      expect(readFile).toHaveBeenCalledTimes(0);

      expect(existsSync).toHaveBeenCalledTimes(1);

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenNthCalledWith(1, "info", "CHECK ROLE", {
        data: { storageData: {}, userUid: "userUid" },
      });
    });

    test("If session file exists we return result from there", async () => {
      existsSync.mockReturnValueOnce(true);
      readFile.mockResolvedValueOnce('{"otherUid":true}');

      const res = await checkRole({
        ...props,
      });

      expect(res).toEqual(null);

      expect(readFile).toHaveBeenCalledTimes(1);

      expect(existsSync).toHaveBeenCalledTimes(1);

      expect(logger.log).toHaveBeenCalledTimes(1);
      expect(logger.log).toHaveBeenNthCalledWith(1, "info", "CHECK ROLE", {
        data: { storageData: { otherUid: true }, userUid: "userUid" },
      });
    });
  });
});
