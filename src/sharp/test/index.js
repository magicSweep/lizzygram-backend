"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
exports.photoSizes = void 0;
var path_1 = require("path");
var performance = require("../../utils/performance");
var __1 = require("..");
var PhotoTransformations_1 = require("../../photos/service/PhotoTransformations");
exports.photoSizes = [
    { width: 320, height: 180 },
    { width: 800, height: 640 },
    { width: 1280, height: 720 },
    { width: 1920, height: 1080 },
    { width: 3840, height: 2160 },
];
var photoName = "16189387096_96879abe89_k.jpg";
var pathToDownloadsDir = "/home/nikki/Downloads";
var pathToResultDir = (0, path_1.resolve)(process.cwd(), "src", "sharp", "test", "result");
var pathToPhoto = "".concat(pathToDownloadsDir, "/").concat(photoName);
var makePaths = (0, PhotoTransformations_1.makePaths_)(exports.photoSizes, pathToResultDir);
var main = function (pathToPhoto) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, isInverted, width, height, randomName, res;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0: return [4 /*yield*/, (0, __1.getPhotoInfo)(pathToPhoto)];
            case 1:
                _a = _b.sent(), isInverted = _a.isInverted, width = _a.width, height = _a.height;
                randomName = "photo_".concat(Math.round(Math.random() * 1000000));
                /* await makeWebp(pathToPhoto, `${pathToResultDir}/final.webp`, { quality: 80 });
              
                await makeWebp(pathToPhoto, `${pathToResultDir}/final_1.webp`, {
                  quality: 100,
                }); */
                performance.mark("start");
                return [4 /*yield*/, (0, __1.resizeOneToBuffer)(pathToPhoto, { height: 1920 })];
            case 2:
                res = _b.sent();
                performance.mark("end");
                return [4 /*yield*/, (0, __1.resizeOne)(pathToPhoto, { height: 1920 }, "".concat(pathToResultDir, "/").concat(randomName, ".webp"))];
            case 3:
                _b.sent();
                performance.mark("end1");
                performance.measure("Resize", "start", "end");
                performance.measure("Resize to file", "end", "end1");
                console.log("RESULT------", res);
                return [2 /*return*/];
        }
    });
}); };
performance.init();
main(pathToPhoto);
/*
const base64ToFile = async (
  pathToPhoto: Path,
  isInv: boolean,
  pathToBase64File: Path
) => {
  const base64Str = await base64(pathToPhoto, isInv);

  promisify(writeFile)(pathToBase64File, base64Str, {
    encoding: "utf-8",
  });
};

const staticDir = resolve(process.cwd(), "src", "static");

const resultDir = resolve(process.cwd(), "src", "sharp", "test", "result");

const resultPaths = new Map([
  [320, `${resultDir}/result_320.webp`],
  [800, `${resultDir}/result_800.webp`],
  [1280, `${resultDir}/result_1280.webp`],
  [1920, `${resultDir}/result_1920.webp`],
  [3840, `${resultDir}/result_3840.webp`],
]);

 const run = async () => {
  performance.start();

  // make resized photos

  // first make optimized photo then make resized photos
  try {
    await webp(`${staticDir}/dream.png`, `${resultDir}/result.webp`, {
      quality: 70,
    });

    const meta = await metadata(`${resultDir}/result.webp`);

    const isInv = isInverted(meta.orientation as number);

    await Promise.all(
      makeDiffSizedPhotos(
        resultPaths,
        { width: meta.width as number, height: meta.height as number },
        isInv,
        photoSizes,
        `${resultDir}/result.webp`
      )
    );
  } catch (err) {
    console.log("-----------------ERROR-----------------");

    console.log(err);

    console.log("-----------------ERROR-----------------");
  }
  //const base64Str = await base64(`${resultDir}/result.jpg`, isInv);

  // promisify(writeFile)(`${resultDir}/base64.txt`, base64Str, {
 //   encoding: "utf-8",
 // });

  performance.end();
};
performance.init();

run();*/
