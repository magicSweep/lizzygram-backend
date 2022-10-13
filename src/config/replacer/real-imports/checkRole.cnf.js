exports.default = [
  {
    pathToFile: "src/auth/middleware/checkRole/index.ts",
    // identify in log messages
    identifier: "REPLACER | REAL IMPORTS | CHECK ROLE MIDDLEWARE",
    replaceable: '"../../service/UserDb/UserDb.fake"',
    replacement: '"../../service/UserDb"',
  },
];
