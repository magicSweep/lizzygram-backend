exports.default = [
  {
    pathToFile: "src/photos/middleware/DownloadPhoto/index.ts",
    // identify in log messages
    identifier: "REPLACER | REAL IMPORTS | DOWNLOAD PHOTO MIDDLEWARE",
    replaceable: '"../../service/OriginalPhotoStore/OriginalPhotoStore.fake"',
    replacement: '"../../service/OriginalPhotoStore"',
  },
];
