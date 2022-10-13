exports.default = [
  {
    pathToFile: "src/photos/middleware/Main/controller/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | MAIN MIDDLEWARE CONTROLLER",
    replaceable: '"../../../service/OriginalPhotoStore"',
    replacement:
      '"../../../service/OriginalPhotoStore/OriginalPhotoStore.fake"',
  },
  {
    pathToFile: "src/photos/middleware/Main/controller/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | MAIN MIDDLEWARE CONTROLLER",
    replaceable: '"../../../service/PhotosWebStore"',
    replacement: '"../../../service/PhotosWebStore/PhotosWebStore.fake"',
  },
];
