/* const cleanupCnf = require("./cleanup.cnf").default;
const downloadMiddlewareCnf = require("./downloadMiddleware.cnf").default;
const mainMiddlewareCnf = require("./mainMiddleware.cnf").default;
const authMiddlewareCnf = require("./auth.cnf").default;
const checkRoleMiddlewareCnf = require("./checkRole.cnf").default;

exports.default = [
  ...cleanupCnf,
  ...downloadMiddlewareCnf,
  //...cnfCnf,
  ...mainMiddlewareCnf,
  ...authMiddlewareCnf,
  ...checkRoleMiddlewareCnf,
]; */

const { join } = require("path");

const importsCommonCnf = require(join(
  process.cwd(),
  "src",
  "config",
  "replacer",
  "common",
  "index.js"
)).default;

//const importsCommonCnf = require("./../commmon/index").default;

const fakeImportsCnf = importsCommonCnf.map((cnf) => {
  cnf.isFake = true;
  cnf.identifier = `${cnf.identifier} | FAKE IMPORTS`;
  cnf.type = "FAKE_API";

  return cnf;
});

exports.default = [...fakeImportsCnf];
