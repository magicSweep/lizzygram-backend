import express, { Request, Response, NextFunction, Express } from "express";
import multer, { Options } from "multer";
import { join } from "path";
//import { fileFilter, fileName, multerMiddleware } from "../multer";
import request from "supertest";
import { init } from "./app";
import { photoFileFilter } from "../fileFilter/photos";

const multerLimits = {
  fields: 6,
  fieldSize: 1052,
  files: 1,
  fileSize: 20971520, //20971520 - 20MB
  headerPairs: 20,
};

const fileFilter: Options["fileFilter"] = (req, file, cb) => {
  console.log("FILE FILTER", req.body);
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  // To reject this file pass `false`, like so:
  //cb(null, false);
  // To accept the file pass `true`, like so:
  //cb(null, true)
  // You can always pass an error if something goes wrong:
  cb(new Error("I don't have a clue!"));
};

const pathToPhoto = join(process.cwd(), "src/static/12.jpg");
const pathToWrongFile = join(process.cwd(), "src/types.ts");
const url = "/test-multer";

let app: Express;

describe("multer", () => {
  describe("Multer file filter - if we failed multer file filter validation we get global error", () => {
    beforeAll(async () => {
      app = await init(multerLimits, photoFileFilter); //
    });

    // FILTER FILE WORK ONLY IF WE HAVE FILE IN OUR POST REQUEST
    test("If we do not have any file in our request - multer do not trigger fileFilter at all", async () => {
      const response = await request(app).post(url);
      //.field("id", "1234567890123")
      //.attach("file", pathToPhoto);

      // '{"status":"success"}'
      expect(response.text).toEqual('{"status":"success"}');
      //expect(response.text.includes("Failed multer validation")).toEqual(true);
    });

    test("We send wrong file mimetype", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "hello1234567890123")
        //.field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .attach("file", pathToWrongFile);

      expect(response.text).toEqual(
        '{"status":"error","error":"Error: Файл должен быть типа: jpeg, png, jpg, webp | video/mp2t","body":{"photoId":"hello1234567890123"}}'
      );
      //expect(response.text.includes('"status":"error"')).toEqual(true);
    });

    test("We send bad photo id", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "hello1234567890123")
        //.field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .attach("file", pathToPhoto);

      expect(response.text).toEqual(
        '{"status":"error","error":"Error: Wrong photo id... | \\"hello1234567890123\\"","body":{"photoId":"hello1234567890123"}}'
      );
      //expect(response.text.includes('"status":"error"')).toEqual(true);
    });

    test("We send bad userUid", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "1234567890123")
        .field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2!!$")
        .attach("file", pathToPhoto);

      expect(response.text).toEqual(
        '{"status":"error","error":"Error: Bad symbols in userUid... | \\"fgTrANbtA4bBEjFsvWWbSOPdfLB2!!$\\"","body":{"photoId":"1234567890123","userUid":"fgTrANbtA4bBEjFsvWWbSOPdfLB2!!$"}}'
      );
      //expect(response.text.includes('"status":"error"')).toEqual(true);
    });

    test.skip("If all okey - we upload file.", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "1234567890123")
        .field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .attach("file", pathToPhoto);

      //expect(response.text).toEqual("hello");
      expect(response.text.includes('status":"success"')).toEqual(true);
    });
  });

  describe("editPhotoFileFilter", () => {
    beforeAll(async () => {
      app = await init(multerLimits, photoFileFilter); //
    });

    // FILTER FILE WORK ONLY IF WE HAVE FILE IN OUR POST REQUEST
    test("If we do not have any file in our request - multer do not trigger fileFilter at all", async () => {
      const response = await request(app).post(url);
      //.field("id", "1234567890123")
      //.attach("file", pathToPhoto);

      // '{"status":"success"}'
      expect(response.text).toEqual('{"status":"success"}');
      //expect(response.text.includes("Failed multer validation")).toEqual(true);
    });

    test("Not valid photo date", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "1234567890123")
        .field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .field("date", "Sat, 08 Jul 2017 00:00:00 GMT")
        .field("description", "Hello, people...")
        .field("tags", JSON.stringify({}))
        .attach("file", pathToPhoto);

      // '{"status":"success"}'
      //expect(response.text).toEqual('{"status":"success"}');
      expect(
        response.text.includes(
          'До дня рождения? | Sat, 08 Jul 2017 00:00:00 GMT"'
        )
      ).toEqual(true);
    });

    test("Not valid tags", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "1234567890123")
        .field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .field("date", "Sat, 08 Jul 2020 00:00:00 GMT")
        .field("description", "Hello, people...")
        .field("tags", JSON.stringify({}))
        .attach("file", pathToPhoto);

      // '{"status":"success"}'
      //expect(response.text).toEqual('{"status":"success"}');
      expect(response.text.includes("Добавьте хотя бы один тэг. | {}")).toEqual(
        true
      );
    });

    test.skip("We do not send additional fields(like desc) - it's okey", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "1234567890123")
        .field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .attach("file", pathToPhoto);

      expect(response.text.includes('status":"success"')).toEqual(true);
    });
  });

  describe("Multer limits - if we failed multer limits validation we get global multer error", () => {
    beforeAll(async () => {
      app = await init(
        {
          ...multerLimits,
          fileSize: 1500,
          fields: 1,
        },
        undefined
      ); //
    });

    test("Too many fields error", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "hello1234567890123")
        .field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .attach("file", pathToPhoto);

      expect(response.text).toEqual(
        '{"status":"error","error":"[MULTER ERROR] | Too many fields","body":{"photoId":"hello1234567890123"}}'
      );
      //expect(response.text.includes('"status":"error"')).toEqual(true);
    });

    test("File too large error", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "hello1234567890123")
        .attach("file", pathToPhoto);

      expect(response.text).toEqual(
        '{"status":"error","error":"[MULTER ERROR] | File too large","body":{"photoId":"hello1234567890123"}}'
      );
      //expect(response.text.includes('"status":"error"')).toEqual(true);
    });

    test("Unexpected field error", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "hello1234567890123")
        .attach("file1", pathToPhoto)
        .attach("file", pathToPhoto);

      expect(response.text).toEqual(
        '{"status":"error","error":"[MULTER ERROR] | Unexpected field","body":{"photoId":"hello1234567890123"}}'
      );
      //expect(response.text.includes('"status":"error"')).toEqual(true);
    });
  });
});

/* describe("multer", () => {
  beforeAll(async () => {
    app = await init();
  });

  test("We send empty body - no erro - we get undefined req.body and empty req.file", async () => {
    const response = await request(app).post(url);
    //.field("id", "1234567890123")
    //.attach("file", pathToPhoto);

    expect(response.text).toEqual('{"status":"success"}');
    //expect(response.text.includes("Failed multer validation")).toEqual(true);
  });

  test.only("If we failed multer validation we get global error", async () => {
    const response = await request(app)
      .post(url)
      .field("id", "1234567890123")
      .field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
      .attach("file", pathToWrongFile);

    //expect(response.text).toEqual('{"status":"success"}');
    expect(response.text.includes('"status":"error"')).toEqual(true);
    //expect(response.text.includes("Failed multer validation")).toEqual(true);
  });
}); */
