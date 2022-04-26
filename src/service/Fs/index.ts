import { unlink, existsSync } from "fs";
import { promisify } from "util";
import { Path } from "../../types";

export const removePhoto = async (path: Path) => {
  if (existsSync(path) === false) {
    return;
  }

  return promisify(unlink)(path);
};

export const removePhotos = (paths: Path[]) => {
  const promises: Promise<any>[] = paths.map((path) => removePhoto(path));

  return Promise.all(promises);
};
