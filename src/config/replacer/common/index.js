exports.default = [
  {
    pathToFile: "src/auth/middleware/authorization/index.ts",
    // identify in log messages
    identifier: "REPLACER | AUTH MIDDLEWARE",
    replaceable: '"../../service/Auth"',
  },
  {
    pathToFile: "src/auth/middleware/checkRole/index.ts",
    // identify in log messages
    identifier: "REPLACER | CHECK ROLE MIDDLEWARE",
    replaceable: '"../../service/UserDb"',
  },
  {
    pathToFile: "src/photos/controller/CleanUp/index.ts",
    // identify in log messages
    identifier: "REPLACER | 1 CLEAN UP CONTROLLER",
    replaceable: '"../../service/PhotosWebStore"',
  },
  {
    pathToFile: "src/photos/controller/CleanUp/index.ts",
    // identify in log messages
    identifier: "REPLACER | 2 CLEAN UP CONTROLLER",
    replaceable: '"../../service/OriginalPhotoStore"',
  },
  {
    pathToFile: "src/photos/middleware/DownloadPhoto/index.ts",
    // identify in log messages
    identifier: "REPLACER | DOWNLOAD PHOTO MIDDLEWARE",
    replaceable: '"../../service/OriginalPhotoStore"',
  },
  {
    pathToFile: "src/photos/middleware/Main/controller/index.ts",
    // identify in log messages
    identifier: "REPLACER | MAIN MIDDLEWARE CONTROLLER",
    replaceable: '"../../../service/OriginalPhotoStore"',
  },
  {
    pathToFile: "src/photos/middleware/Main/controller/index.ts",
    // identify in log messages
    identifier: "REPLACER | MAIN MIDDLEWARE CONTROLLER",
    replaceable: '"../../../service/PhotosWebStore"',
  },
];
