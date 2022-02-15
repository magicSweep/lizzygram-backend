"use strict";
exports.__esModule = true;
exports.makePaths = exports.makePaths_ = exports.makeOptimizedByWidthPhotoFiles = exports.makeBase64String = exports.getPhotoInfo = void 0;
var sharp_1 = require("./../../../sharp");
var PhotoTransformations_helper_1 = require("./PhotoTransformations.helper");
var config_1 = require("../../../config");
// base64String, aspectRatio, imageExtention
// makeOptimizedByWidthPhotoFiles
var getPhotoInfo = function (pathToPhoto) { return (0, sharp_1.getPhotoInfo)(pathToPhoto); };
exports.getPhotoInfo = getPhotoInfo;
var makeBase64String = function (pathToImage, isInverted) {
    return (0, sharp_1.makeBase64)(pathToImage, isInverted);
};
exports.makeBase64String = makeBase64String;
var makeOptimizedByWidthPhotoFiles = function (resultPaths, currentPhotoSize, isInverted, desiredPhotoSizes, pathToOriginalImage) {
    return (0, sharp_1.resizeMany)(resultPaths, currentPhotoSize, isInverted, desiredPhotoSizes, pathToOriginalImage);
};
exports.makeOptimizedByWidthPhotoFiles = makeOptimizedByWidthPhotoFiles;
var makePaths_ = function (photoSizes, pathToOptimizedPhotosDir) {
    return function (photoFileName) {
        //we make pathsFileSystem: Map<width, path>
        var photoname = (0, PhotoTransformations_helper_1.getFileNameWithoutExtension)(photoFileName);
        var paths = new Map();
        for (var _i = 0, photoSizes_1 = photoSizes; _i < photoSizes_1.length; _i++) {
            var sizes = photoSizes_1[_i];
            paths.set(sizes.width, "".concat(pathToOptimizedPhotosDir, "/").concat((0, PhotoTransformations_helper_1.makePhotoName)(sizes.width, photoname)));
        }
        return paths;
    };
};
exports.makePaths_ = makePaths_;
exports.makePaths = (0, exports.makePaths_)(config_1.photoSizes, config_1.pathToOptimizedPhotosDir);
