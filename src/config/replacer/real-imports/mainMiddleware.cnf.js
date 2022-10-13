exports.default = [
  {
    pathToFile: "src/photos/middleware/Main/controller/index.ts",
    // identify in log messages
    identifier: "REPLACER | REAL IMPORTS | MAIN MIDDLEWARE CONTROLLER",
    replaceable:
      '"../../../service/OriginalPhotoStore/OriginalPhotoStore.fake"',
    replacement: '"../../../service/OriginalPhotoStore"',
  },
  {
    pathToFile: "src/photos/middleware/Main/controller/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | MAIN MIDDLEWARE CONTROLLER",
    replaceable: '"../../../service/PhotosWebStore/PhotosWebStore.fake"',
    replacement: '"../../../service/PhotosWebStore"',
  },
];
