exports.default = [
  {
    pathToFile: "src/auth/middleware/checkRole/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | CHECK ROLE MIDDLEWARE",
    replaceable: '"../../service/UserDb"',
    replacement: '"../../service/UserDb/UserDb.fake"',
  },
];
