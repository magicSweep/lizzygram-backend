import { Path } from "../../types";

export type ResizeManyProps = {
  resultPaths: Map<number, Path>;
  currentPhotoSize: { width: number; height: number };
  isInverted: boolean;
  desiredPhotoSizes: { width: number; height: number }[];
  pathToOriginalImage: Path;
};
