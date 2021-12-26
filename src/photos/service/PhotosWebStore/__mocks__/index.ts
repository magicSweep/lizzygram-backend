export const removePhotos = jest.fn();
export const uploadPhotos = jest.fn().mockResolvedValue("photoImagesInfo[]");
export const makeWebImagesInfo = jest.fn().mockResolvedValue({
  ids: ["id-1", "id-2"],
  urls: new Map([
    [800, "https://v.ru/800"],
    [1280, "https://v.ru/1280"],
  ]),
});
