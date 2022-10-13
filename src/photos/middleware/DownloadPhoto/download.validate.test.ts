import { validateReqParams } from "./download.validate";

describe("validateReqParams - /download validate request params", () => {
  test.each([
    {
      count: 1,
      reqData: { reqParams: {} },
      expected: "No or bad query params...",
    },
    {
      count: 2,
      reqData: { reqParams: { name: "blala" } },
      expected: "No or bad query params...",
    },
    {
      count: 3,
      reqData: {
        reqQuery: { name: "blala", gid: "googleId" },
      },
      expected: "No or bad query params...",
    },
    {
      count: 4,
      reqData: {
        reqQuery: { name: "blala", gid: "googleId", token: "super_token" },
      },
      expected: true,
    },
  ])(
    "#$count -- If not validated we get error msg in return.",
    ({ count, reqData, expected }) => {
      const res = validateReqParams(reqData as any);

      expect(res).toEqual(expected);
    }
  );
});
