"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.testDownloadPhoto = exports.testEditPhoto = exports.testAddPhoto = void 0;
var path_1 = require("path");
var request_1 = require("../service/request");
var fs_1 = require("fs");
var util_1 = require("util");
var fmagic_1 = require("fmagic");
var winston_1 = require("../logger/winston");
//import FormData from "form-data";
var FormData = require("form-data");
//const { Blob } = require("buffer");
var config_1 = require("../config");
var PhotosDb_1 = require("../photos/service/PhotosDb");
var userUid = "kMwibQErO6dDH6gf3entRLqFBop2";
var photoId = "88354434515782";
var getPhotoId = function () { return photoId; };
var setPhotoId = function (photoId_) { return (photoId = photoId_); };
// add photo
exports.testAddPhoto = (0, fmagic_1.compose)(function () {
    return fmagic_1.NI_Next.of({
        pathToPhoto: (0, path_1.join)(process.cwd(), "src", "static", "13.jpg"),
        photoId: (90000000000000 - Date.now()).toString(),
        userUid: userUid
    });
}, 
// add photo to firestore
(0, fmagic_1.chain)(function (data) {
    return (0, fmagic_1.compose)(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, PhotosDb_1.addPhoto)({
                        id: data.photoId,
                        tags: {
                            werwew: true,
                            sfefew: true
                        },
                        isActive: false,
                        description: "Hello, my friend",
                        date: new Date("2020-05-08"),
                        addedByUserUID: "kMwibQErO6dDH6gf3entRLqFBop2"
                    }, data.photoId)];
                case 1:
                    _a.sent();
                    return [2 /*return*/, data];
            }
        });
    }); }, (0, fmagic_1.then)(function (data) { return fmagic_1.NI_Next.of(data); }), (0, fmagic_1._catch)(function (err) {
        return fmagic_1.Done.of(__assign(__assign({}, data), { error: err.message }));
    }))();
}), 
// make form data
(0, fmagic_1.then)((0, fmagic_1.map)(function (data) {
    var formData = new FormData();
    formData.append("photoId", data.photoId);
    formData.append("userUid", data.userUid);
    formData.append("file", (0, fs_1.createReadStream)(data.pathToPhoto));
    data.formData = formData;
    return data;
})), 
// send request to worker
(0, fmagic_1.then)((0, fmagic_1.chain)(function (data) {
    return (0, fmagic_1.compose)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [__assign({}, data)];
                    _b = {};
                    return [4 /*yield*/, (0, request_1.postFormData)("http://localhost:3009/".concat(config_1.addPhotoUrl), data.formData)];
                case 1: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.response = _c.sent(), _b)])))];
            }
        });
    }); }, (0, fmagic_1.then)(function (data) { return fmagic_1.NI_Next.of(data); }), (0, fmagic_1._catch)(function (err) {
        return fmagic_1.Done.of(__assign(__assign({}, data), { error: err.message }));
    }))();
})), (0, fmagic_1.thenDoneFold)(function (data) {
    setPhotoId(data.photoId);
    winston_1.logger.log("info", "ADD PHOTO TEST RESULT", {
        photoId: data.photoId,
        userUid: data.userUid,
        responseData: data.response !== undefined ? data.response.data : ""
    });
}, function (data) {
    return winston_1.logger.log("error", "ADD PHOTO TEST ERROR", {
        photoId: data.photoId,
        userUid: data.userUid,
        error: data.error
    });
})
// get info about photo from firestore
// check google drive file
// check cloudinary images
// remove firebase, google drive, cloudinary
);
// edit photo
// send request with FormData - photoFile, date, tags, description
exports.testEditPhoto = (0, fmagic_1.compose)(function () {
    return fmagic_1.NI_Next.of({
        pathToPhoto: (0, path_1.join)(process.cwd(), "src", "static", "dream.png"),
        photoId: getPhotoId(),
        userUid: userUid
    });
}, 
// make form data
(0, fmagic_1.map)(function (data) {
    var formData = new FormData();
    formData.append("photoId", data.photoId);
    formData.append("userUid", data.userUid);
    formData.append("date", new Date("2017-03-02").toUTCString());
    formData.append("tags", JSON.stringify({ boom2: true, groom1: true }));
    formData.append("description", "Goodbye, bye, bye...");
    formData.append("file", (0, fs_1.createReadStream)(data.pathToPhoto));
    data.formData = formData;
    return data;
}), 
// send request to worker
(0, fmagic_1.chain)(function (data) {
    return (0, fmagic_1.compose)(function () { return __awaiter(void 0, void 0, void 0, function () {
        var _a;
        var _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = [__assign({}, data)];
                    _b = {};
                    return [4 /*yield*/, (0, request_1.postFormData)("http://localhost:3009/".concat(config_1.editPhotoUrl), data.formData)];
                case 1: return [2 /*return*/, (__assign.apply(void 0, _a.concat([(_b.response = _c.sent(), _b)])))];
            }
        });
    }); }, (0, fmagic_1.then)(function (data) { return fmagic_1.NI_Next.of(data); }), (0, fmagic_1._catch)(function (err) {
        return fmagic_1.Done.of(__assign(__assign({}, data), { error: err.message }));
    }))();
}), (0, fmagic_1.thenDoneFold)(function (data) {
    photoId = data.photoId;
    winston_1.logger.log("info", "EDIT PHOTO TEST RESULT", {
        photoId: data.photoId,
        userUid: data.userUid,
        responseData: {
            status: data.response !== undefined ? data.response.status : "",
            statusText: data.response !== undefined ? data.response.statusText : "",
            data: data.response !== undefined ? data.response.data : ""
        }
    });
}, function (data) {
    return winston_1.logger.log("error", "EDIT PHOTO TEST ERROR", {
        photoId: data.photoId,
        userUid: data.userUid,
        error: data.error,
        responseData: {
            status: data.response !== undefined ? data.response.status : "",
            statusText: data.response !== undefined ? data.response.statusText : "",
            data: data.response !== undefined ? data.response.data : ""
        }
    });
})
// get info about photo from firestore
// check google drive file
// check cloudinary images
// remove firebase, google drive, cloudinary
);
// download photo
//   - send request with query param userUid + googleDriveId + .jpeg
//   - get stream response
//   - check saved photo( and delete)
var testDownloadPhoto = function () { return __awaiter(void 0, void 0, void 0, function () {
    var pathToPhoto;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                pathToPhoto = (0, path_1.join)(process.cwd(), "upload", "streamedPhoto.jpg");
                //console.log("PATH TO PHOTO", pathToPhoto);
                return [4 /*yield*/, (0, request_1.getStream)("http://localhost:3009/download/kMwibQErO6dDH6gf3entRLqFBop21JpdtwHEsOnaYI9TEFID4qtIErE3vV_vs", 
                    //"http://localhost:3009/download",
                    pathToPhoto)];
            case 1:
                //console.log("PATH TO PHOTO", pathToPhoto);
                _a.sent();
                console.assert((0, fs_1.existsSync)(pathToPhoto) === true, {
                    errorMsg: "Photo not downloaded...."
                });
                return [4 /*yield*/, (0, util_1.promisify)(fs_1.unlink)(pathToPhoto)];
            case 2:
                _a.sent();
                console.assert((0, fs_1.existsSync)(pathToPhoto) === false, {
                    errorMsg: "Photo was not deleted.... | ".concat(pathToPhoto)
                });
                console.log("NO ERROR MSGS - MEANS SUCCESS DOWNLOAD TEST.");
                return [2 /*return*/];
        }
    });
}); };
exports.testDownloadPhoto = testDownloadPhoto;
