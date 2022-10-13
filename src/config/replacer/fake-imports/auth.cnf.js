exports.default = [
  {
    pathToFile: "src/auth/middleware/authorization/index.ts",
    // identify in log messages
    identifier: "REPLACER | FAKE IMPORTS | AUTH MIDDLEWARE",
    replaceable: '"../../service/Auth"',
    replacement: '"../../service/Auth/Auth.fake"',
  },
];
