export const getPhotoInfo = jest.fn().mockResolvedValue({
  aspectRatio: 1.8,
  isInverted: false,
  imageExtention: "png",
  width: 1920,
  height: 1080,
});
export const makePaths = jest.fn().mockReturnValue(
  new Map([
    [800, "/800.webp"],
    [1280, "/1280.webp"],
  ])
);
export const makeOptimizedByWidthPhotoFiles = jest.fn().mockResolvedValue([
  {
    format: "image/webp",
    size: 12345,
    width: 800,
    height: 640,
  },
  {
    format: "image/webp",
    size: 22345,
    width: 1280,
    height: 720,
  },
]);
export const makeBase64String = jest.fn().mockResolvedValue("base64String");
