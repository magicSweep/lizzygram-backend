import { validateReqParams } from "./download.validate";

describe("validateReqParams - /download validate request params", () => {
  test.each([
    { count: 0, reqData: {}, expected: "No googleDriveId or fileName" },
    {
      count: 1,
      reqData: { reqParams: {} },
      expected: "No googleDriveId or fileName",
    },
    {
      count: 2,
      reqData: { reqBody: { googleDriveId: "blala" } },
      expected: "No googleDriveId or fileName",
    },
  ])(
    "#$count -- If not validated we get error msg in return.",
    ({ count, reqData, expected }) => {
      const res = validateReqParams(reqData as any);

      expect(res).toEqual(expected);
    }
  );
});
