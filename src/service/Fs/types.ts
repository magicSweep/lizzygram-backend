import { Path } from "../../types";

export type Fs = {
  removePhoto: (path: Path) => Promise<void>;

  removePhotos: (paths: Path[]) => Promise<any[]>;
};
