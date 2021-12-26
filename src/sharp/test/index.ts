import { writeFile } from "fs";
/* import { resolve } from "path";
import { promisify } from "util";
import { photoSizes } from "../../config";
import { Path } from "../../types";
import * as performance from "../../utils/performance";
import {
  makeDiffSizedPhotos,
  makeBase64s,
  makePlaceholders,
} from ".";
import { jpeg, webp, isInverted, metadata, base64 } from "../SharpImage";

const pathToDir = resolve(process.cwd(), "src", "static");

console.log("PARH----------", pathToDir);

makePlaceholders(pathToDir); */

/*
const base64ToFile = async (
  pathToPhoto: Path,
  isInv: boolean,
  pathToBase64File: Path
) => {
  const base64Str = await base64(pathToPhoto, isInv);

  promisify(writeFile)(pathToBase64File, base64Str, {
    encoding: "utf-8",
  });
};

const staticDir = resolve(process.cwd(), "src", "static");

const resultDir = resolve(process.cwd(), "src", "sharp", "test", "result");

const resultPaths = new Map([
  [320, `${resultDir}/result_320.webp`],
  [800, `${resultDir}/result_800.webp`],
  [1280, `${resultDir}/result_1280.webp`],
  [1920, `${resultDir}/result_1920.webp`],
  [3840, `${resultDir}/result_3840.webp`],
]);

 const run = async () => {
  performance.start();

  // make resized photos

  // first make optimized photo then make resized photos
  try {
    await webp(`${staticDir}/dream.png`, `${resultDir}/result.webp`, {
      quality: 70,
    });

    const meta = await metadata(`${resultDir}/result.webp`);

    const isInv = isInverted(meta.orientation as number);

    await Promise.all(
      makeDiffSizedPhotos(
        resultPaths,
        { width: meta.width as number, height: meta.height as number },
        isInv,
        photoSizes,
        `${resultDir}/result.webp`
      )
    );
  } catch (err) {
    console.log("-----------------ERROR-----------------");

    console.log(err);

    console.log("-----------------ERROR-----------------");
  }
  //const base64Str = await base64(`${resultDir}/result.jpg`, isInv);

  // promisify(writeFile)(`${resultDir}/base64.txt`, base64Str, {
 //   encoding: "utf-8",
 // }); 

  performance.end();
}; 
performance.init();

run();*/
