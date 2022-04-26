// check how if work if firestore or data from file will be undefined or "" empty
import { onCleanup_ } from "./cleanup";

/* 
 (
    getExpirationDateFromFirestore: () => Promise<Date>,
    saveNewExpirationDateToFirestore: (date: Date) => Promise<void>,
    sendRequestToCleanupService: () => Promise<void>,
    calcNewExpirationData: () => Date,
    readFile: typeof readFile_,
    writeFile: typeof writeFile_
  ) =>
  (logger: Logger) 
*/

const cleanupCnf = {
  //pathToFileWithExpirationData: "src/expiration-date.js",
  daysToNextCleanup: 7,

  collectionName: "expiration-date",
  docId: "expired",
  //const fieldName = "date";

  cleanupServiceUrl: "http://localhost:9001",
};

describe("onCleanup_", () => {
  const getExpirationDateFromFirestore = jest.fn(() => Promise.resolve());

  const saveNewExpirationDateToFirestore = jest.fn(() => Promise.resolve());
  const sendRequestToCleanupService = jest.fn(() => Promise.resolve());

  const calcNewExpirationDate = jest.fn(() => "calc new Date()");

  const getExpirationDate = jest.fn(() => "saved expiration date");
  const setExpirationDate = jest.fn();

  /* const getExpirationDateFromFs = jest.fn(() =>
    Promise.resolve("new Date().toUTCString()")
  ); */
  //const saveNewExpirationDateToFs = jest.fn(() => Promise.resolve());
  //const existsSync = jest.fn(() => true);
  const isDateExpired = jest.fn(() => false);

  const logger = {
    log: jest.fn(),
  };

  const onCleanup = onCleanup_(
    getExpirationDate as any,
    setExpirationDate,
    getExpirationDateFromFirestore as any,
    //getExpirationDateFromFs as any,
    saveNewExpirationDateToFirestore as any,
    //saveNewExpirationDateToFs,
    sendRequestToCleanupService as any,
    calcNewExpirationDate as any,
    isDateExpired as any
    //existsSync
  )(logger as any);

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("If we got saved not expired date - we do nothing", async () => {
    await onCleanup(cleanupCnf);

    //expect(existsSync).toHaveBeenCalledTimes(1);

    expect(getExpirationDate).toHaveBeenCalledTimes(1);
    expect(getExpirationDateFromFirestore).toHaveBeenCalledTimes(0);

    expect(isDateExpired).toHaveBeenCalledTimes(1);
    expect(isDateExpired).toHaveBeenNthCalledWith(1, "saved expiration date");

    expect(calcNewExpirationDate).toHaveBeenCalledTimes(0);

    expect(saveNewExpirationDateToFirestore).toHaveBeenCalledTimes(0);
    expect(sendRequestToCleanupService).toHaveBeenCalledTimes(0);
    expect(setExpirationDate).toHaveBeenCalledTimes(0);

    expect(logger.log).toHaveBeenCalledTimes(0);
  });

  test("If we got saved  expired date - we calc and save new one and send request to cleanup service", async () => {
    isDateExpired.mockReturnValueOnce(true);

    await onCleanup(cleanupCnf);

    //expect(existsSync).toHaveBeenCalledTimes(1);

    expect(getExpirationDate).toHaveBeenCalledTimes(1);
    expect(getExpirationDateFromFirestore).toHaveBeenCalledTimes(0);

    expect(isDateExpired).toHaveBeenCalledTimes(1);

    expect(calcNewExpirationDate).toHaveBeenCalledTimes(1);

    expect(saveNewExpirationDateToFirestore).toHaveBeenCalledTimes(1);
    expect(sendRequestToCleanupService).toHaveBeenCalledTimes(1);
    expect(setExpirationDate).toHaveBeenCalledTimes(1);

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenNthCalledWith(
      1,
      "info",
      "SUCCESS UPDATE CLEAN_UP EXPIRATION DATE",
      {
        data: {
          config: {
            cleanupServiceUrl: "http://localhost:9001",
            collectionName: "expiration-date",
            daysToNextCleanup: 7,
            docId: "expired",
          },
          expirationDate: "saved expiration date",
          isCleanupDataExpires: true,
          newExpirationDate: "calc new Date()",
        },
      }
    );
  });

  test("If we got error - we log it", async () => {
    getExpirationDate.mockReturnValueOnce(undefined as any);
    getExpirationDateFromFirestore.mockRejectedValueOnce(
      "Bad fat error from fs..."
    );

    await onCleanup(cleanupCnf);

    //expect(existsSync).toHaveBeenCalledTimes(1);

    expect(getExpirationDate).toHaveBeenCalledTimes(1);
    expect(getExpirationDateFromFirestore).toHaveBeenCalledTimes(1);

    expect(isDateExpired).toHaveBeenCalledTimes(0);

    expect(calcNewExpirationDate).toHaveBeenCalledTimes(0);

    expect(saveNewExpirationDateToFirestore).toHaveBeenCalledTimes(0);
    expect(sendRequestToCleanupService).toHaveBeenCalledTimes(0);
    expect(setExpirationDate).toHaveBeenCalledTimes(0);

    expect(logger.log).toHaveBeenCalledTimes(1);
    expect(logger.log).toHaveBeenNthCalledWith(
      1,
      "error",
      "ERROR ON CLEAN UP MIDDLEWARE",
      { data: { error: "Bad fat error from fs..." } }
    );
  });
});
