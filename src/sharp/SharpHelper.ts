import { readdir } from "fs";
import { resolve } from "path";
import { Metadata } from "sharp";
import { promisify } from "util";
import { compose, then } from "../utils/func";
import { Path } from "./../types";
// TODO add .js
import { base64, isInverted, metadata, resize } from "./SharpImage";

const config = {
  desiredPhotoSizes: [{ width: 200, height: 100 }],
  pathToOriginalImage: "",
};

export const makeResizeOptions = (
  isInverted: boolean,
  currentPhotoSize: { width: number; height: number },
  desiredPhotoSize: { width: number; height: number }
) =>
  isInverted || currentPhotoSize.height >= currentPhotoSize.width
    ? { height: desiredPhotoSize.height }
    : { width: desiredPhotoSize.width };

export const makeDiffSizedPhotos = (
  resultPaths: Map<number, Path>,
  currentPhotoSize: { width: number; height: number },
  isInverted: boolean,
  desiredPhotoSizes: { width: number; height: number }[],
  pathToOriginalImage: Path
) =>
  desiredPhotoSizes.map((desiredPhotoSize, i) =>
    resize(
      pathToOriginalImage,
      makeResizeOptions(isInverted, currentPhotoSize, desiredPhotoSize),
      resultPaths.get(desiredPhotoSize.width) as Path
    )
  );

// read dir

// make base 64
// save to file

export const makeBase64s = compose<Path>(
  promisify(readdir),
  then((pathToFiles: string[]) =>
    pathToFiles.map((path) =>
      compose(
        metadata(resolve(`${pathToFiles}/${path}`)),
        then((meta: Metadata) => isInverted(meta.orientation as number))
        //then((isInverted: boolean) => base64(path, isInverted))
      )
    )
  )
);
