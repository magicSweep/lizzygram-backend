"use strict";
exports.__esModule = true;
exports.makePhotoName = exports.getFileNameWithoutExtension = void 0;
var getFileNameWithoutExtension = function (filename) {
    var parts = filename.split(".");
    if (parts.length === 1)
        return filename;
    if (parts.length === 2)
        return parts[0];
    if (parts.length > 2) {
        parts.pop();
        var res = parts.filter(function (val) {
            //@ts-ignore
            return val != false;
        });
        //console.log(JSON.stringify(res));
        return res.join(".");
    }
    return filename;
};
exports.getFileNameWithoutExtension = getFileNameWithoutExtension;
var makePhotoName = function (width, name) {
    return "".concat(name, "-").concat(width, ".webp");
};
exports.makePhotoName = makePhotoName;
