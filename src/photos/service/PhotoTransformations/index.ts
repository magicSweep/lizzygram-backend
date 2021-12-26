import { Path, Width } from "../../../types";
import {
  makeBase64,
  getPhotoInfo as getPhotoInfo_,
  resizeMany,
} from "./../../../sharp";
import {
  makePhotoName,
  getFileNameWithoutExtension,
} from "./PhotoTransformations.helper";
import { pathToOptimizedPhotosDir, photoSizes } from "../../../config";

// base64String, aspectRatio, imageExtention
// makeOptimizedByWidthPhotoFiles

export const getPhotoInfo = (pathToPhoto: Path) => getPhotoInfo_(pathToPhoto);

export const makeBase64String = (pathToImage: Path, isInverted: boolean) =>
  makeBase64(pathToImage, isInverted);

export const makeOptimizedByWidthPhotoFiles = (
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
  );

export const makePaths_ =
  (
    photoSizes: { width: number; height: number }[],
    pathToOptimizedPhotosDir: string
  ) =>
  (photoFileName: string) => {
    //we make pathsFileSystem: Map<width, path>

    const photoname = getFileNameWithoutExtension(photoFileName);

    const paths: Map<Width, Path> = new Map();

    for (let sizes of photoSizes) {
      paths.set(
        sizes.width,
        `${pathToOptimizedPhotosDir}/${makePhotoName(sizes.width, photoname)}`
      );
    }

    return paths;
  };

export const makePaths = makePaths_(photoSizes, pathToOptimizedPhotosDir);
