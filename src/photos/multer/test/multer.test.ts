import express, { Request, Response, NextFunction, Express } from "express";
import multer, { Options } from "multer";
import { join } from "path";
//import { fileFilter, fileName, multerMiddleware } from "../multer";
import request from "supertest";
import { init } from "./app";
import { photoFileFilter } from "../fileFilter";

const multerLimits = {
  fields: 0,
  fieldSize: 1052,
  files: 1,
  fileSize: 20971520, //20971520 - 20MB
  headerPairs: 20,
};

/* const fileFilter: Options["fileFilter"] = (req, file, cb) => {
  console.log("FILE FILTER", req.body);
  // The function should call `cb` with a boolean
  // to indicate if the file should be accepted
  // To reject this file pass `false`, like so:
  //cb(null, false);
  // To accept the file pass `true`, like so:
  //cb(null, true)
  // You can always pass an error if something goes wrong:
  cb(new Error("I don't have a clue!"));
}; */

const pathToPhoto = join(process.cwd(), "src/static/12.jpg");
const pathToWrongFile = join(process.cwd(), "src/types.ts");
const url = "/test-multer";

let app: Express;

describe("multer", () => {
  describe("Multer file filter", () => {
    beforeAll(async () => {
      app = await init(multerLimits, photoFileFilter); //
    });

    // FILTER FILE WORK ONLY IF WE HAVE FILE IN OUR POST REQUEST
    test("If we do not have any file in our request - we return bad request", async () => {
      const response = await request(app).post(url);
      //.field("id", "1234567890123")
      //.attach("file", pathToPhoto);

      // '{"status":"success"}'
      expect(response.text).toEqual("");
      expect(response.status).toEqual(400);
      //expect(response.text.includes("Failed multer validation")).toEqual(true);
    });

    test("If wrong file mimetype - we return bad request", async () => {
      const response = await request(app)
        .post(url)
        .attach("file", pathToWrongFile);

      expect(response.text).toEqual("");
      expect(response.status).toEqual(400);
    });

    test("If request contain extra text field - we return bad request", async () => {
      const response = await request(app)
        .post(url)
        .field("photoId", "hello1234567890123")
        //.field("userUid", "fgTrANbtA4bBEjFsvWWbSOPdfLB2")
        .attach("file", pathToPhoto);

      expect(response.text).toEqual("");
      expect(response.status).toEqual(400);
    });

    test.skip("If all okey - we upload file.", async () => {
      const response = await request(app).post(url).attach("file", pathToPhoto);

      expect(response.status).toEqual(200);
      expect(response.text).toEqual("");
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
