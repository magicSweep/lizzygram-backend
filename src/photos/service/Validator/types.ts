export type Validator = {
  isValidPhotoFile: (file: Express.Multer.File) => string | boolean;
};
