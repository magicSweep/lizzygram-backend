import { resolve } from "path";
import { makeBase64s } from "./SharpHelper";

describe("makeBase64s", () => {
  const pathToDir = resolve(__dirname, "..", "static");
  test("", async () => {
    const res = await makeBase64s(pathToDir);

    expect(res).toEqual("Helo");
  });
});
