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
exports.makeBase64s = exports.resizeMany = exports.getPhotoInfo = exports.makeResizeOptions = exports.jpeg = exports.makeBase64 = exports.resizeOne = exports.resizeOneToBuffer = exports.makeWebp = exports.getAspectRatio = exports.getIsInverted = exports.getMetadata = void 0;
var path_1 = require("path");
var fs_1 = require("fs");
var util_1 = require("util");
var fmagic_1 = require("fmagic");
var sharp = require("sharp");
//import { getPlaiceholder } from "plaiceholder";
//import { TPath } from "../types";
//type SHARP_WIDTH = 400 | 800 | 1600 | 2000;
var getMetadata = function (pathToImage) {
    return sharp(pathToImage).metadata();
};
exports.getMetadata = getMetadata;
// const exifHeader = metadata.orientation
var getIsInverted = function (exifHeader) {
    return [6, 8, 5, 7].includes(exifHeader);
};
exports.getIsInverted = getIsInverted;
var getAspectRatio = function (
//metadata: sharp.Metadata,
height, width, isInverted) {
    return isInverted === true
        ? Math.round((height / width) * 100) / 100
        : Math.round((width / height) * 100) / 100;
};
exports.getAspectRatio = getAspectRatio;
var makeWebp = function (pathToImage, pathToResultImage, options) { return __awaiter(void 0, void 0, void 0, function () {
    var res, format, width, height, size;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sharp(pathToImage)
                    .webp(options)
                    .rotate()
                    .toFile(pathToResultImage)];
            case 1:
                res = _a.sent();
                format = res.format, width = res.width, height = res.height, size = res.size;
                return [2 /*return*/, {
                        format: format,
                        width: width,
                        height: height,
                        size: size
                    }];
        }
    });
}); };
exports.makeWebp = makeWebp;
/* export const resizeOneWithWebp = async (
  pathToImage: Path,
  resizedOptions: {
    width?: number;
    height?: number;
  },
  //quality: number,
  pathToResizedFile: Path
): Promise<TransformedImageInfo> => {
  const res = await sharp(pathToImage)
    //.withMetadata()
    .resize(resizedOptions)
    .webp()
    .rotate()
    .toFile(pathToResizedFile);

  const { format, width, height, size } = res;

  return {
    format,
    width,
    height,
    size,
  };
}; */
var resizeOneToBuffer = function (pathToImage, resizedOptions
//quality: number,
//pathToResizedFile: Path
) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, data, _b, width, height, size, format;
    return __generator(this, function (_c) {
        switch (_c.label) {
            case 0: return [4 /*yield*/, sharp(pathToImage)
                    //.withMetadata()
                    .webp()
                    .resize(resizedOptions)
                    //.jpeg({ quality: quality })
                    .rotate()
                    .toBuffer({ resolveWithObject: true })];
            case 1:
                _a = _c.sent(), data = _a.data, _b = _a.info, width = _b.width, height = _b.height, size = _b.size, format = _b.format;
                //const {width, height, size, format} = info;
                return [2 /*return*/, {
                        format: format,
                        width: width,
                        height: height,
                        size: size,
                        buffer: data
                    }];
        }
    });
}); };
exports.resizeOneToBuffer = resizeOneToBuffer;
var resizeOne = function (pathToImage, resizedOptions, 
//quality: number,
pathToResizedFile) { return __awaiter(void 0, void 0, void 0, function () {
    var res, format, width, height, size;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sharp(pathToImage)
                    //.withMetadata()
                    .resize(resizedOptions)
                    //.jpeg({ quality: quality })
                    .rotate()
                    .toFile(pathToResizedFile)];
            case 1:
                res = _a.sent();
                format = res.format, width = res.width, height = res.height, size = res.size;
                return [2 /*return*/, {
                        format: format,
                        width: width,
                        height: height,
                        size: size
                    }];
        }
    });
}); };
exports.resizeOne = resizeOne;
var makeBase64 = function (pathToImage, isInverted) { return __awaiter(void 0, void 0, void 0, function () {
    var resizedOptions, encode;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                resizedOptions = isInverted
                    ? { height: 8 } //10
                    : { width: 8 };
                return [4 /*yield*/, sharp(pathToImage)
                        //.withMetadata()
                        //.jpeg({ quality: 40 })
                        .webp({ quality: 80 })
                        .blur()
                        .resize(resizedOptions)
                        /*  .normalise()
                        .modulate({
                          saturation: 1.2,
                          brightness: 1,
                        }) */
                        //.removeAlpha()
                        .rotate()
                        .toBuffer()];
            case 1:
                encode = _a.sent();
                return [2 /*return*/, encode.toString("base64")];
        }
    });
}); };
exports.makeBase64 = makeBase64;
// { quality: 50, progressive: true }
var jpeg = function (pathToImage, pathToResultImage, options) { return __awaiter(void 0, void 0, void 0, function () {
    var res, format, width, height, size;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, sharp(pathToImage).jpeg(options).toFile(pathToResultImage)];
            case 1:
                res = _a.sent();
                format = res.format, width = res.width, height = res.height, size = res.size;
                return [2 /*return*/, {
                        format: format,
                        width: width,
                        height: height,
                        size: size
                    }];
        }
    });
}); };
exports.jpeg = jpeg;
var makeResizeOptions = function (isInverted, currentPhotoSize, desiredPhotoSize) {
    return isInverted || currentPhotoSize.height >= currentPhotoSize.width
        ? { height: desiredPhotoSize.height }
        : { width: desiredPhotoSize.width };
};
exports.makeResizeOptions = makeResizeOptions;
exports.getPhotoInfo = (0, fmagic_1.compose)(exports.getMetadata, (0, fmagic_1.then)(function (_a) {
    var orientation = _a.orientation, width = _a.width, height = _a.height, format = _a.format, size = _a.size;
    var isInverted = orientation === undefined ? false : (0, exports.getIsInverted)(orientation);
    return {
        aspectRatio: (0, exports.getAspectRatio)(height, width, isInverted),
        isInverted: isInverted,
        imageExtention: format,
        width: width,
        height: height,
        size: size
    };
}));
var resizeMany = function (resultPaths, currentPhotoSize, isInverted, desiredPhotoSizes, pathToOriginalImage) { return __awaiter(void 0, void 0, void 0, function () {
    var requests, results;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                requests = desiredPhotoSizes.map(function (desiredPhotoSize, i) {
                    return (0, exports.resizeOne)(pathToOriginalImage, (0, exports.makeResizeOptions)(isInverted, currentPhotoSize, desiredPhotoSize), resultPaths.get(desiredPhotoSize.width));
                });
                return [4 /*yield*/, Promise.all(requests)];
            case 1:
                results = _a.sent();
                return [2 /*return*/, results.map(function (res, i) {
                        var format = res.format, width = res.width, height = res.height, size = res.size;
                        return {
                            format: format,
                            width: width,
                            height: height,
                            size: size
                        };
                    })];
        }
    });
}); };
exports.resizeMany = resizeMany;
exports.makeBase64s = (0, fmagic_1.compose)(function (pathToDir) { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = {
                    pathToDir: pathToDir
                };
                return [4 /*yield*/, (0, util_1.promisify)(fs_1.readdir)(pathToDir)];
            case 1: return [2 /*return*/, (_a.names = _b.sent(),
                    _a)];
        }
    });
}); }, (0, fmagic_1.then)(function (_a) {
    var pathToDir = _a.pathToDir, names = _a.names;
    return Promise.all(names.map((0, fmagic_1.compose)(function (name) { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = {};
                    return [4 /*yield*/, (0, exports.getMetadata)((0, path_1.resolve)("".concat(pathToDir, "/").concat(name)))];
                case 1: return [2 /*return*/, (_a.meta = _b.sent(),
                        _a.name = name,
                        _a)];
            }
        });
    }); }, (0, fmagic_1.then)(function (_a) {
        var meta = _a.meta, name = _a.name;
        return ({
            isInverted: (0, exports.getIsInverted)(meta.orientation),
            height: meta.height,
            width: meta.width,
            name: name
        });
    }), (0, fmagic_1.then)(function (_a) {
        var height = _a.height, width = _a.width, isInverted = _a.isInverted, name = _a.name;
        return ({
            aspectRatio: (0, exports.getAspectRatio)(height, width, isInverted),
            isInverted: isInverted,
            name: name
        });
    }), (0, fmagic_1.then)(function (_a) {
        var aspectRatio = _a.aspectRatio, isInverted = _a.isInverted, name = _a.name;
        return __awaiter(void 0, void 0, void 0, function () {
            var _b;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _b = {
                            name: name,
                            aspectRatio: aspectRatio
                        };
                        return [4 /*yield*/, (0, exports.makeBase64)((0, path_1.resolve)("".concat(pathToDir, "/").concat(name)), isInverted)];
                    case 1: return [2 /*return*/, (_b.base64 = _c.sent(),
                            _b)];
                }
            });
        });
    }))));
})
/* then((data: any[]) =>
  promisify(writeFile)(pathToResult, JSON.stringify(data), {
    encoding: "utf-8",
  })
) */
);
/* export const makePlaceholders = compose(
  async (pathToDir: string) => ({
    pathToDir: pathToDir,
    names: await promisify(readdir)(pathToDir),
  }),
  then(
    tap(({ pathToDir, names }: any) =>
      console.log("---------", pathToDir, names)
    )
  ),
  then(({ pathToDir, names }: any) =>
    Promise.all(
      names.map(
        compose(
          async (name: Path) => ({
            meta: await getMetadata(`${pathToDir}/${name}`),
            name,
          }),
          then(({ meta, name }: { name: string; meta: Metadata }) => ({
            isInverted: getIsInverted(meta.orientation as number),
            height: meta.height,
            width: meta.width,
            name,
          })),
          then(({ height, width, isInverted, name }: any) => ({
            aspectRatio: getAspectRatio(height, width, isInverted),
            isInverted,
            name,
          })),
          then(async ({ aspectRatio, isInverted, name }: any) => {
            console.log("++++++++++++", `${pathToDir}/${name}`);
            return {
              name,
              aspectRatio: aspectRatio,
              base64: await getPlaiceholder(`${pathToDir}/${name}`),
            };
          })
        )
      )
    )
  )
  //then((data: any[]) => console.log("RESULT", data))
  /// then((data: any[]) =>
  //  promisify(writeFile)(pathToResult, JSON.stringify(data), {
 //     encoding: "utf-8",
  //  })
  //)
); */
