import { Path, Width } from "../../../types";
import {
  makeBase64 as makeBase64String,
  getPhotoInfo as getPhotoInfo_,
  resizeMany,
} from "./../../../service/sharp";
import { makePaths_ } from "./PhotoTransformations.helper";
import { pathToOptimizedPhotosDir, photoSizes } from "../../../config";
import { PhotoTransformations } from "./types";

// base64String, aspectRatio, imageExtention
// makeOptimizedByWidthPhotoFiles

export const makeOptimizedPhotos_: (
  desiredPhotoSizes: { width: number; height: number }[],
  makePaths: (fileName: string) => Map<number, string>
) => PhotoTransformations["makeOptimizedPhotos"] =
  (desiredPhotoSizes, makePaths) => async (props) => {
    const optimizedPhotosPaths = makePaths(props.photoFileName);

    return {
      optimizedImageInfo: await resizeMany({
        desiredPhotoSizes,
        resultPaths: optimizedPhotosPaths,
        ...props,
      }),
      optimizedPhotosPaths,
    };
  };

/* export const makeOptimizedByWidthPhotoFiles = (
  resultPaths: Map<number, Path>,
  currentPhotoSize: { width: number; height: number },
  isInverted: boolean,
  desiredPhotoSizes: { width: number; height: number }[],
  pathToOriginalImage: Path
) =>
  resizeMany(
    resultPaths,
    currentPhotoSize,
    isInverted,
    desiredPhotoSizes,
    pathToOriginalImage
  ); */

const makePaths = makePaths_(photoSizes, pathToOptimizedPhotosDir);

export const makePhotoInfo: PhotoTransformations["makePhotoInfo"] =
  getPhotoInfo_;

export const makeBase64: PhotoTransformations["makeBase64"] = makeBase64String;

export const makeOptimizedPhotos = makeOptimizedPhotos_(photoSizes, makePaths);
