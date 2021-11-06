import sharp, { Sharp, Metadata, OutputInfo } from "sharp";
import { resolve } from "path";
import { promisify } from "util";
import fs, { existsSync } from "fs";
//import { TPath } from "../types";

//type SHARP_WIDTH = 400 | 800 | 1600 | 2000;

type Path = string;

export const metadata = (pathToImage: Path) => {
  return sharp(pathToImage).metadata();
};

// const exifHeader = metadata.orientation
export const isInverted = (exifHeader: number) =>
  [6, 8, 5, 7].includes(exifHeader);

export const aspectRatio = (
  //metadata: sharp.Metadata,
  height: number,
  width: number,
  isInverted: boolean
) =>
  isInverted === true
    ? Math.round((height / width) * 100) / 100
    : Math.round((width / height) * 100) / 100;

export const webp = (
  pathToImage: Path,
  pathToResultImage: Path,
  options?: sharp.WebpOptions
) => sharp(pathToImage).webp(options).rotate().toFile(pathToResultImage);

export const resize = (
  pathToImage: Path,
  resizedOptions: {
    width?: number;
    height?: number;
  },
  //quality: number,
  pathToResizedFile: Path
) =>
  sharp(pathToImage)
    //.withMetadata()
    .resize(resizedOptions)
    //.jpeg({ quality: quality })
    .rotate()
    .toFile(pathToResizedFile);

/* const pipeline = sharp(src).resize(size, size, {
    fit: "inside"
  });
  const getOptimizedForBase64 = pipeline.clone().normalise().modulate({
    saturation: 1.2,
    brightness: 1
  }).removeAlpha().toBuffer({
    resolveWithObject: true
  }); */

export const base64 = async (pathToImage: Path, isInverted: boolean) => {
  const resizedOptions: sharp.ResizeOptions = isInverted
    ? { height: 4 }
    : { width: 4 };
  //resizedOptions.fit = "inside";

  const encode = await sharp(pathToImage)
    //.withMetadata()
    //.jpeg({ quality: 40 })
    .blur()
    .resize(resizedOptions)
    /*  .normalise()
    .modulate({
      saturation: 1.2,
      brightness: 1,
    }) */
    //.removeAlpha()
    .rotate()
    .toBuffer();
  return encode.toString("base64");
};

// { quality: 50, progressive: true }
export const jpeg = (
  pathToImage: Path,
  pathToResultImage: Path,
  options?: sharp.JpegOptions
) => sharp(pathToImage).jpeg(options).toFile(pathToResultImage);
