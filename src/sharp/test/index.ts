import { writeFile } from "fs";
import { resolve } from "path";
import { promisify } from "util";
import { Path } from "../../types";
import * as performance from "../../service/performance";
import {
  jpeg,
  getPhotoInfo,
  resizeMany,
  makeWebp,
  resizeOneToBuffer,
  resizeOne,
} from "..";
import { makePaths_ } from "../../photos/service/PhotoTransformations";
import { winstonLogger } from "../../logger";

export const photoSizes = [
  { width: 320, height: 180 },
  { width: 800, height: 640 },
  { width: 1280, height: 720 },
  { width: 1920, height: 1080 },
  { width: 3840, height: 2160 },
];

const photoName = "16189387096_96879abe89_k.jpg";

const pathToDownloadsDir = "/home/nikki/Downloads";
const pathToResultDir = resolve(
  process.cwd(),
  "src",
  "sharp",
  "test",
  "result"
);

const pathToPhoto = `${pathToDownloadsDir}/${photoName}`;

const makePaths = makePaths_(photoSizes, pathToResultDir);

const main = async (pathToPhoto: string) => {
  const { isInverted, width, height } = await getPhotoInfo(pathToPhoto);

  const randomName = `photo_${Math.round(Math.random() * 1000000)}`;

  /* await makeWebp(pathToPhoto, `${pathToResultDir}/final.webp`, { quality: 80 });

  await makeWebp(pathToPhoto, `${pathToResultDir}/final_1.webp`, {
    quality: 100,
  }); */

  performance.mark("start");

  const res = await resizeOneToBuffer(pathToPhoto, { height: 1920 });

  performance.mark("end");

  await resizeOne(
    pathToPhoto,
    { height: 1920 },
    `${pathToResultDir}/${randomName}.webp`
  );

  performance.mark("end1");

  performance.measure("Resize", `start`, `end`);

  performance.measure("Resize to file", `end`, `end1`);

  console.log("RESULT------", res);

  /* await resizeMany(
    makePaths(randomName),
    { width, height },
    isInverted,
    photoSizes,
    pathToPhoto
  ); */
};

performance.init(winstonLogger);

main(pathToPhoto);

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
