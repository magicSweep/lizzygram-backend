import { Path, Width } from "../../../types";

export const getFileNameWithoutExtension = (filename: string) => {
  const parts = filename.split(".");

  if (parts.length === 1) return filename;

  if (parts.length === 2) return parts[0];

  if (parts.length > 2) {
    parts.pop();
    const res = parts.filter((val) => {
      //@ts-ignore
      return val != false;
    });

    //console.log(JSON.stringify(res));
    return res.join(".");
  }

  return filename;
};

export const makePhotoName = (width: number, name: string) => {
  return `${name}-${width}.webp`;
};

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
