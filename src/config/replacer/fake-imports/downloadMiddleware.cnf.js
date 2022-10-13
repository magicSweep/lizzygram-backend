exports.default = [
  {
    pathToFile: "src/photos/middleware/DownloadPhoto/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | DOWNLOAD PHOTO MIDDLEWARE",
    replaceable: '"../../service/OriginalPhotoStore"',
    replacement: '"../../service/OriginalPhotoStore/OriginalPhotoStore.fake"',
  },
];
