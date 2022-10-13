exports.default = [
  {
    pathToFile: "src/auth/middleware/authorization/index.ts",
    // identify in log messages
    identifier: "REPLACER | REAL IMPORTS | AUTH MIDDLEWARE",
    replaceable: '"../../service/Auth/Auth.fake"',
    replacement: '"../../service/Auth"',
  },
];
