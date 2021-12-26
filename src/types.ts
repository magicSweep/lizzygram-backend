export type OriginalPhotoInfo = {
  id?: string | null;
  name?: string | null;
};

export type PhotoInfo = {
  aspectRatio: number;
  imageExtention: string;
  isInverted: boolean;
  width: number;
  height: number;
};

export type WebImageInfo = {
  id: PhotoWebId;
  url: WebSecureUrl;
};

export type WebImagesInfo = {
  ids: PhotoWebId[];
  urls: Map<Width, WebSecureUrl>;
};

export type TransformedImageInfo = {
  format: string;
  size: number;
  width: number;
  height: number;
};

export type Path = string;

export type Width = number;

export type PhotoWebId = string;

export type WebSecureUrl = string;

// COMMON TYPES
export type ImgExt = "jpeg" | "jpg" | "png";
export type FirestoreDate = {
  toDate: () => Date;
};

export interface Photo<T> {
  id: any;
  base64: string;

  files: string[];
  aspectRatio: number; //1.6
  srcSet: string;
  iconSrc: string;
  src: string;

  _timestamp: Date | FirestoreDate;
  description: string;
  date: T;
  yearsOld: number;
  tags: {
    [id: string]: boolean;
  };

  googleDriveId: string;
  imageExtention: ImgExt;
  addedByUserUID: string;
  // do we make changes by express
  isActive: boolean;
}

export type PhotoFieldsToUpdateOnAdd = {
  base64: string;

  files: string[];
  aspectRatio: number; //1.6
  srcSet: string;
  iconSrc: string;
  src: string;

  //_timestamp: Date | FirestoreDate;

  imageExtention: ImgExt;
  // do we make changes by express
  isActive: boolean;
};

export type PhotoFieldsToUpdateOnEdit = PhotoFieldsToUpdateOnAdd & {
  description?: string;
  date?: Date;
  yearsOld?: number;
  tags?: {
    [id: string]: boolean;
  };
};

export type ResponseStatus = "successs" | "error";

export type WorkerResponse = {
  status: ResponseStatus;
  data?: {
    [name: string]: any;
  };
  error?: {
    msg: string;
    code?: number;
  };
};

export type JsonString = string;

export type FrontendRequestBody = {
  photoFile: Express.Multer.File;
  photoId: string;
  userUid: string;
  description?: string;
  date?: DateUTCString;
  tags?: JsonString;
};

export type TagsData = { [id: string]: boolean };

// Date.toUTCString();
export type DateUTCString = string;

/* interface MulterBody {
  file: Express.Multer.File;
  id: string;
  userUid: string;
}

interface MulterRequest extends Express.Request {
  body: MulterBody;
} */

// MIDDLEWARES

export type PhotoMiddlewareDone<T> = {
  data: T;
  error: any;
};

/* export type PhotoMiddlewareData = {
  type: "ADD" | "EDIT";
} */

export type AddPhotoData = {
  reqInfo: FrontendRequestBody;
  photoInfo?: PhotoInfo;
  optimizedPhotosPaths?: Map<Width, Path>;
  webImagesInfo?: WebImagesInfo;
  error?: any;
  optimizedImageInfo?: TransformedImageInfo[];
  base64String?: string;
};

export type EditPhotoData = AddPhotoData & {
  prevWebImagesIds?: PhotoWebId[];
  prevGoogleDriveId?: string;
};

// PHOTO SERVICES

export type ValidatorService = {
  isValidPhotoDbRecord: (
    photoId: string,
    photo: Photo<FirestoreDate> | undefined,
    userUid: string
  ) => string | true;

  isValidPhotoDbRecordOnAdd: (
    photoId: string,
    photo: Photo<FirestoreDate> | undefined,
    userUid: string
  ) => string | true;

  isValidPhotoDbRecordOnEdit: (
    photoId: string,
    photo: Photo<FirestoreDate> | undefined,
    userUid: string
  ) => string | true;

  isValidUserUid: (val: string | undefined) => string | true;

  isValidPhotoID: (photoId: string) => string | true;

  isValidDate: (data: DateUTCString) => string | true;

  isValidPhotoFile: (file: Express.Multer.File) => string | true;

  isValidDesc: (val: string | undefined) => string | true;

  isValidTags: (tags?: JsonString) => string | true;
};

export type PhotoTransformationsService = {
  getPhotoInfo: (pathToPhoto: Path) => Promise<PhotoInfo>;

  makeBase64String: (pathToImage: Path, isInverted: boolean) => Promise<string>;

  makeOptimizedByWidthPhotoFiles: (
    resultPaths: Map<number, Path>,
    currentPhotoSize: { width: number; height: number },
    isInverted: boolean,
    desiredPhotoSizes: { width: number; height: number }[],
    pathToOriginalImage: Path
  ) => Promise<TransformedImageInfo[]>;

  makePaths: (photoFileName: string) => Map<Width, Path>;
};

export type PhotosWebStoreService = {
  init: () => void;

  uploadPhotos: (
    pathsToPhotos: Path[]
  ) => Promise<{ id: string; url: string }[]>;

  makeWebImagesInfo: (
    imagesInfo: WebImageInfo[],
    pathsByWidths: Map<Width, Path>
  ) => WebImagesInfo;

  removePhotos: (publicIds: string[]) => void;
};

export type PhotosDbService = {
  getPhoto: (photoId: string) => Promise<Photo<FirestoreDate> | undefined>;

  updatePhoto: (photoId: string, fieldsToUpdate: any) => Promise<boolean>;

  removePhoto: (photoId: string) => Promise<boolean>;
};

export type OriginalPhotoStoreService = {
  init: () => Promise<boolean>;

  isExists: (photoId: string) => Promise<boolean>;

  save: (
    photoFileName: string,
    pathToPhoto: Path
  ) => Promise<{ id: string; name: string }>;

  update: (
    googleDriveId: string,
    pathToPhoto: Path
  ) => Promise<{ id: string; name: string }>;

  download: (fileId: string, destPath: Path) => Promise<boolean>;
};

export type FsService = {
  removePhoto: (path: Path) => void;

  removePhotos: (paths: Path[]) => void;
};
