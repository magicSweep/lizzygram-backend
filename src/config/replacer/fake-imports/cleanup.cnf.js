exports.default = [
  {
    pathToFile: "src/photos/controller/CleanUp/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | 1 CLEAN UP CONTROLLER",
    replaceable: '"../../service/PhotosWebStore"',
    replacement: '"../../service/PhotosWebStore/PhotosWebStore.fake"',
  },
  {
    pathToFile: "src/photos/controller/CleanUp/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | 2 CLEAN UP CONTROLLER",
    replaceable: '"../../service/OriginalPhotoStore"',
    replacement: '"../../service/OriginalPhotoStore/OriginalPhotoStore.fake"',
  },
];
