import wait from "waait";
import { Path, PhotoInfo, TransformedImageInfo } from "../types";

// base64String, aspectRatio, imageExtention
// makeOptimizedByWidthPhotoFiles

export const getPhotoInfo = async (pathToPhoto: Path): Promise<PhotoInfo> => {
  await wait(1000);

  return {
    aspectRatio: 1.8,
    imageExtention: "jpeg",
    isInverted: false,
    width: 1920,
    height: 1080,
  };
};

export const makeBase64 = async (
  pathToImage: Path,
  isInverted: boolean
): Promise<string> => {
  await 1000;

  return "perfect_base_64_string";
};

/* interface OutputInfo {
        format: string;
        size: number;
        width: number;
        height: number;
        channels: number;
    } */
export const resizeMany = async (
  resultPaths: Map<number, Path>,
  currentPhotoSize: { width: number; height: number },
  isInverted: boolean,
  desiredPhotoSizes: { width: number; height: number }[],
  pathToOriginalImage: Path
): Promise<TransformedImageInfo[]> => {
  await wait(2000);

  return desiredPhotoSizes.map((size, i) => {
    return {
      format: "webp",
      size: 1111,
      width: size.width,
      height: size.height,
    };
  });
};
