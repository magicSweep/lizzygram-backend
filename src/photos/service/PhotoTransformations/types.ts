import { PhotoInfo, TransformedImageInfo, Path, Width } from "../../../types";
import { ResizeManyProps } from "../../../service/sharp/types";

export type MakeOptimizedPhotosProps = Omit<
  ResizeManyProps,
  "resultPaths" | "desiredPhotoSizes"
> & {
  /*  resultPaths: Map<number, Path>;
  currentPhotoSize: { width: number; height: number };
  isInverted: boolean;
  desiredPhotoSizes: { width: number; height: number }[];
  pathToOriginalImage: Path; */
  //pathToOptimizedPhotosDir: string;
  photoFileName: string;
};

export type PhotoTransformations = {
  makePhotoInfo: (pathToPhoto: Path) => Promise<PhotoInfo>;
  // makeOptimizedPhotos in parrarel with makeBase64
  makeOptimizedPhotos: (
    props: MakeOptimizedPhotosProps
  ) => Promise<{
    optimizedImageInfo: TransformedImageInfo[];
    optimizedPhotosPaths: Map<Width, Path>;
  }>;
  makeBase64: (pathToPhoto: Path, isInverted: boolean) => Promise<string>;
};

export type PhotoTransformationsData = {
  photoInfo?: PhotoInfo;
  optimizedPhotosPaths?: Map<Width, Path>;
  error?: any;
  optimizedImageInfo?: TransformedImageInfo[];
  base64String?: string;
};
