import { cleanUpParamsValidate } from "./cleanUp.validate";

describe("cleanUpParamsValidate - /cleanup validate request params", () => {
  test.each([
    {
      count: 1,
      reqData: {},
      expected: "Bad request body...",
    },
    {
      count: 2,
      reqData: { reqBody: {} },
      expected: "Bad request body...",
    },
    {
      count: 3,
      reqData: {
        reqBody: { googleDriveId: "blala" },
      },
      expected: "Bad request body...",
    },
    {
      count: 4,
      reqData: {
        reqBody: { webImagesInfo: { ids: [] } },
      },
      expected: "Bad request body...",
    },
    {
      count: 5,
      reqData: {
        reqBody: { googleDriveId: [], webImagesInfo: { ids: [] } },
      },
      expected: "googleDriveId must be string...",
    },
    {
      count: 6,
      reqData: {
        reqBody: { googleDriveId: "lajfdlajf", webImagesInfo: { ids: "" } },
      },
      expected: "webImagesInfo ids must be array of strings...",
    },
    /*  {
      count: 7,
      reqData: {
        reqBody: {
          googleDriveId: "lajfdlajf",
          webImagesInfo: {
            ids: ["tmctifub0ngzt9ostrqe", "wndvy6vjpyyrss4a5ao1"],
          },
        },
      },
      expected: "webImagesInfo ids wrong array length...",
    }, */
    {
      count: 8,
      reqData: {
        reqBody: {
          googleDriveId: "lajfdlajf",
          webImagesInfo: {
            ids: [
              "tmctifub0ngzt9ostrqe",
              "wndvy6vjpyyrss4a5ao1",
              "lncgio62ognjnnojnfhn",
              "svm93mxbydvvvykvtred",
              "qs2bcx6uaxplozkqr2vb",
            ],
          },
        },
      },
      expected: true,
    },
  ])(
    "#$count -- If not validated we get error msg in return.",
    ({ reqData, expected }) => {
      const res = cleanUpParamsValidate(reqData as any);

      expect(res).toEqual(expected);
    }
  );
});
