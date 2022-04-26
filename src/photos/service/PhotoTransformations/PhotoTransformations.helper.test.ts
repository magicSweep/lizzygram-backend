import { makePaths_ } from "./PhotoTransformations.helper";

describe("makePaths_", () => {
  /*  (
    photoSizes: { width: number; height: number }[],
    pathToOptimizedPhotosDir: string
  ) =>
  (photoFileName: string)  */

  const photoSizes = [
    { width: 400, height: 600 },
    { width: 1280, height: 720 },
  ];

  const pathToOptimizedPhotosDir = "/path/to/photos-dir";

  const photoFileName = "hello.png";

  const makePaths = makePaths_(photoSizes, pathToOptimizedPhotosDir);

  test("If all okey - we get ", () => {
    const res = makePaths(photoFileName);

    expect([...res]).toEqual([
      [400, "/path/to/photos-dir/hello-400.webp"],
      [1280, "/path/to/photos-dir/hello-1280.webp"],
    ]);
  });
});
