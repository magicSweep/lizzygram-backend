import {
  /* sharp, */ Sharp,
  Metadata,
  OutputInfo,
  WebpOptions,
  ResizeOptions,
  JpegOptions,
} from "sharp";
import { resolve } from "path";
import { existsSync } from "fs";
import { readdir, writeFile } from "fs";
import { promisify } from "util";
import { compose, tap, then } from "fmagic";
import { Path, PhotoInfo, TransformedImageInfo } from "./../types";
const sharp = require("sharp");
//import { getPlaiceholder } from "plaiceholder";

//import { TPath } from "../types";

//type SHARP_WIDTH = 400 | 800 | 1600 | 2000;

export const getMetadata = (pathToImage: Path) => {
  return sharp(pathToImage).metadata();
};

// const exifHeader = metadata.orientation
export const getIsInverted = (exifHeader: number) =>
  [6, 8, 5, 7].includes(exifHeader);

export const getAspectRatio = (
  //metadata: sharp.Metadata,
  height: number,
  width: number,
  isInverted: boolean
) =>
  isInverted === true
    ? Math.round((height / width) * 100) / 100
    : Math.round((width / height) * 100) / 100;

export const makeWebp = async (
  pathToImage: Path,
  pathToResultImage: Path,
  options?: WebpOptions
): Promise<TransformedImageInfo> => {
  const res = await sharp(pathToImage)
    .webp(options)
    .rotate()
    .toFile(pathToResultImage);

  const { format, width, height, size } = res;

  return {
    format,
    width,
    height,
    size,
  };
};

/* export const resizeOneWithWebp = async (
  pathToImage: Path,
  resizedOptions: {
    width?: number;
    height?: number;
  },
  //quality: number,
  pathToResizedFile: Path
): Promise<TransformedImageInfo> => {
  const res = await sharp(pathToImage)
    //.withMetadata()
    .resize(resizedOptions)
    .webp()
    .rotate()
    .toFile(pathToResizedFile);

  const { format, width, height, size } = res;

  return {
    format,
    width,
    height,
    size,
  };
}; */

export const resizeOneToBuffer = async (
  pathToImage: Path,
  resizedOptions: {
    width?: number;
    height?: number;
  }
  //quality: number,
  //pathToResizedFile: Path
): Promise<TransformedImageInfo> => {
  const {
    data,
    info: { width, height, size, format },
  } = await sharp(pathToImage)
    //.withMetadata()
    .webp()
    .resize(resizedOptions)
    //.jpeg({ quality: quality })
    .rotate()
    .toBuffer({ resolveWithObject: true });

  //const {width, height, size, format} = info;

  return {
    format,
    width,
    height,
    size,
    buffer: data,
  };
};

export const resizeOne = async (
  pathToImage: Path,
  resizedOptions: {
    width?: number;
    height?: number;
  },
  //quality: number,
  pathToResizedFile: Path
): Promise<TransformedImageInfo> => {
  const res = await sharp(pathToImage)
    //.withMetadata()
    .resize(resizedOptions)
    //.jpeg({ quality: quality })
    .rotate()
    .toFile(pathToResizedFile);

  const { format, width, height, size } = res;

  return {
    format,
    width,
    height,
    size,
  };
};

export const makeBase64 = async (pathToImage: Path, isInverted: boolean) => {
  const resizedOptions: ResizeOptions = isInverted
    ? { height: 8 } //10
    : { width: 8 };
  //resizedOptions.fit = "inside";

  const encode = await sharp(pathToImage)
    //.withMetadata()
    //.jpeg({ quality: 40 })
    .webp({ quality: 80 })
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
export const jpeg = async (
  pathToImage: Path,
  pathToResultImage: Path,
  options?: JpegOptions
): Promise<TransformedImageInfo> => {
  const res = await sharp(pathToImage).jpeg(options).toFile(pathToResultImage);

  const { format, width, height, size } = res;

  return {
    format,
    width,
    height,
    size,
  };
};

export const makeResizeOptions = (
  isInverted: boolean,
  currentPhotoSize: { width: number; height: number },
  desiredPhotoSize: { width: number; height: number }
) =>
  isInverted || currentPhotoSize.height >= currentPhotoSize.width
    ? { height: desiredPhotoSize.height }
    : { width: desiredPhotoSize.width };

export const getPhotoInfo = compose<Path, Promise<PhotoInfo>>(
  getMetadata,
  then(({ orientation, width, height, format, size }: Metadata) => {
    const isInverted =
      orientation === undefined ? false : getIsInverted(orientation);
    return {
      aspectRatio: getAspectRatio(
        height as number,
        width as number,
        isInverted
      ),
      isInverted,
      imageExtention: format,
      width,
      height,
      size,
    };
  })
);

export const resizeMany = async (
  resultPaths: Map<number, Path>,
  currentPhotoSize: { width: number; height: number },
  isInverted: boolean,
  desiredPhotoSizes: { width: number; height: number }[],
  pathToOriginalImage: Path
): Promise<TransformedImageInfo[]> => {
  const requests = desiredPhotoSizes.map((desiredPhotoSize, i) =>
    resizeOne(
      pathToOriginalImage,
      makeResizeOptions(isInverted, currentPhotoSize, desiredPhotoSize),
      resultPaths.get(desiredPhotoSize.width) as Path
    )
  );

  const results = await Promise.all(requests);

  return results.map((res, i) => {
    const { format, width, height, size } = res;

    return {
      format,
      width,
      height,
      size,
    };
  });
};

export const makeBase64s = compose(
  async (pathToDir: string) => ({
    pathToDir: pathToDir,
    names: await promisify(readdir)(pathToDir),
  }),
  then(({ pathToDir, names }: any) =>
    Promise.all(
      names.map(
        compose(
          async (name: Path) => ({
            meta: await getMetadata(resolve(`${pathToDir}/${name}`)),
            name,
          }),
          then(({ meta, name }: { name: string; meta: Metadata }) => ({
            isInverted: getIsInverted(meta.orientation as number),
            height: meta.height,
            width: meta.width,
            name,
          })),
          then(({ height, width, isInverted, name }: any) => ({
            aspectRatio: getAspectRatio(height, width, isInverted),
            isInverted,
            name,
          })),
          then(async ({ aspectRatio, isInverted, name }: any) => ({
            name,
            aspectRatio: aspectRatio,
            base64: await makeBase64(
              resolve(`${pathToDir}/${name}`),
              isInverted
            ),
          }))
        )
      )
    )
  )
  /* then((data: any[]) =>
    promisify(writeFile)(pathToResult, JSON.stringify(data), {
      encoding: "utf-8",
    })
  ) */
);

/* export const makePlaceholders = compose(
  async (pathToDir: string) => ({
    pathToDir: pathToDir,
    names: await promisify(readdir)(pathToDir),
  }),
  then(
    tap(({ pathToDir, names }: any) =>
      console.log("---------", pathToDir, names)
    )
  ),
  then(({ pathToDir, names }: any) =>
    Promise.all(
      names.map(
        compose(
          async (name: Path) => ({
            meta: await getMetadata(`${pathToDir}/${name}`),
            name,
          }),
          then(({ meta, name }: { name: string; meta: Metadata }) => ({
            isInverted: getIsInverted(meta.orientation as number),
            height: meta.height,
            width: meta.width,
            name,
          })),
          then(({ height, width, isInverted, name }: any) => ({
            aspectRatio: getAspectRatio(height, width, isInverted),
            isInverted,
            name,
          })),
          then(async ({ aspectRatio, isInverted, name }: any) => {
            console.log("++++++++++++", `${pathToDir}/${name}`);
            return {
              name,
              aspectRatio: aspectRatio,
              base64: await getPlaiceholder(`${pathToDir}/${name}`),
            };
          })
        )
      )
    )
  )
  //then((data: any[]) => console.log("RESULT", data))
  /// then((data: any[]) =>
  //  promisify(writeFile)(pathToResult, JSON.stringify(data), {
 //     encoding: "utf-8",
  //  })
  //) 
); */
