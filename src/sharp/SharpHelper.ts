import { readdir, writeFile } from "fs";
import { resolve } from "path";
import { Metadata } from "sharp";
import { promisify } from "util";
import { compose, tap, then } from "fmagic";
import { Path } from "./../types";
// TODO add .js
import {
  aspectRatio,
  base64,
  isInverted,
  metadata,
  resize,
} from "./SharpImage";
import { getPlaiceholder } from "plaiceholder";

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

const pathToResult = resolve(
  process.cwd(),
  "src",
  "sharp",
  "test",
  "result",
  "photosInfo.json"
);

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
            meta: await metadata(resolve(`${pathToDir}/${name}`)),
            name,
          }),
          then(({ meta, name }: { name: string; meta: Metadata }) => ({
            isInverted: isInverted(meta.orientation as number),
            height: meta.height,
            width: meta.width,
            name,
          })),
          then(({ height, width, isInverted, name }: any) => ({
            aspectRatio: aspectRatio(height, width, isInverted),
            isInverted,
            name,
          })),
          then(async ({ aspectRatio, isInverted, name }: any) => ({
            name,
            aspectRatio: aspectRatio,
            base64: await base64(resolve(`${pathToDir}/${name}`), isInverted),
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

export const makePlaceholders = compose(
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
            meta: await metadata(`${pathToDir}/${name}`),
            name,
          }),
          then(({ meta, name }: { name: string; meta: Metadata }) => ({
            isInverted: isInverted(meta.orientation as number),
            height: meta.height,
            width: meta.width,
            name,
          })),
          then(({ height, width, isInverted, name }: any) => ({
            aspectRatio: aspectRatio(height, width, isInverted),
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
  /* then((data: any[]) =>
    promisify(writeFile)(pathToResult, JSON.stringify(data), {
      encoding: "utf-8",
    })
  ) */
);

/*  Promise.all(
      names.map((name: Path) => {
        return metadata(resolve(`${pathToDir}/${name}`))
          .then((meta: Metadata) => ({
            isInverted: isInverted(meta.orientation as number),
            height: meta.height,
            width: meta.width,
          }))
          .then(({ height, width, isInverted }: any) => ({
            aspectRatio: aspectRatio(height, width, isInverted),
            isInverted,
          }))
          .then(async ({ aspectRatio, isInverted }: any) => ({
            name,
            aspectRatio: aspectRatio,
            base64: await base64(resolve(`${pathToDir}/${name}`), isInverted),
          }));
      })
    ) */

/* export const makeBase64s = (pathToDir: string) =>
  compose<Path>(
    promisify(readdir),
    then((pathToFiles: string[]) =>
      pathToFiles.map((path: Path) =>
        metadata(resolve(`${pathToDir}/${path}`))
          .then((meta: Metadata) => ({
            isInverted: isInverted(meta.orientation as number),
            height: meta.height,
            width: meta.width,
          }))
          .then((neededMeta: any) => ({
            aspectRatio: aspectRatio(
              neededMeta.height,
              neededMeta.width,
              neededMeta.isInverted
            ),
            isInverted: neededMeta.isInverted,
          }))
          .then((data: any) => ({
            aspectRatio: data.aspectRatio,
            base64: base64(resolve(`${pathToDir}/${path}`), data.isInverted),
          }))
      )
    )
  )(pathToDir);
 */
