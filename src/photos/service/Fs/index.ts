import { unlink, existsSync } from "fs";
import { promisify } from "util";
import { Path } from "../../../types";

export const removePhoto = (path: Path) => {
  if (existsSync(path) === false) {
    console.error(`No photo to delete - ${path}`);
    return;
  }

  promisify(unlink)(path).catch((err: any) => {
    console.error(
      `Can't delete photo file - ${path} | ${
        err.message === undefined ? JSON.stringify(err) : err.message
      }`
    );
  });
};

export const removePhotos = (paths: Path[]) => {
  paths.map((path, i) => removePhoto(path));
};
