import { isValidAddPhotoReqParams, AddPhotoFileFilterData } from "./photos";

describe("Photos file filter", () => {
  describe("isValidAddPhotoReqParams", () => {
    test("", () => {
      /* {
          mimetype: "image/png",
          size: 123434,
        } */
      const data: AddPhotoFileFilterData = {
        photoFile: undefined as any,
        photoId: "",
        userUid: "",
      };

      const res = isValidAddPhotoReqParams(data);

      expect(res).toEqual("Неверный тип файла - undefined");
    });
  });
});
