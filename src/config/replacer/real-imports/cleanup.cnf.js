exports.default = [
  {
    pathToFile: "src/photos/controller/CleanUp/index.ts",
    // identify in log messages
    identifier: "REPLACER | REAL IMPORTS | 1 CLEAN UP CONTROLLER",
    replaceable: '"../../service/PhotosWebStore/PhotosWebStore.fake"',
    replacement: '"../../service/PhotosWebStore"',
  },
  {
    pathToFile: "src/photos/controller/CleanUp/index.ts",
    // identify in log messages
    identifier: "REPLACER | REAL IMPORTS | 2 CLEAN UP CONTROLLER",
    replaceable: '"../../service/OriginalPhotoStore/OriginalPhotoStore.fake"',
    replacement: '"../../service/OriginalPhotoStore"',
  },
];
