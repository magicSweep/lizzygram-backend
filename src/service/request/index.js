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
exports.__esModule = true;
exports.getStream = exports.postFormData = exports.get = void 0;
var axios_1 = require("axios");
var fs_1 = require("fs");
// url - '/user?ID=12345'
var get = function (url, options) {
    if (options === void 0) { options = {}; }
    return (0, axios_1["default"])(__assign({ method: "get", url: url }, options));
};
exports.get = get;
var postFormData = function (url, data
//options: RequestOptions = {} as any
) {
    //const headers = options.headers !== undefined ? options.headers : {};
    //headers["Content-Type"] = "multipart/form-data";
    return (0, axios_1["default"])({
        method: "post",
        url: url,
        data: data,
        headers: data.getHeaders()
    });
};
exports.postFormData = postFormData;
var getStream = function (url, pathToFile, options) {
    if (options === void 0) { options = {}; }
    return new Promise(function (resolve, reject) {
        var writeStream = (0, fs_1.createWriteStream)(pathToFile);
        writeStream.on("finish", function () {
            resolve(true);
        });
        writeStream.on("error", function (err) {
            reject(err.message);
        });
        (0, axios_1["default"])(__assign({ method: "get", url: url, responseType: "stream" }, options)).then(function (response) {
            //console.log("RESPONSE", response.status, response.statusText);
            //console.log("RESPONSE HEADERS", response.headers);
            response.data.pipe(writeStream);
        });
    });
};
exports.getStream = getStream;
/* GET STREAM RESPONSE

axios({
  method: 'get',
  url: 'http://bit.ly/2mTM3nY',
  responseType: 'stream'
})
  .then(function (response) {
    response.data.pipe(fs.createWriteStream('ada_lovelace.jpg'))
  });

*/
/*  POST REQUEST

axios({
  method: 'post',
  url: '/user/12345',
  data: {
    firstName: 'Fred',
    lastName: 'Flintstone'
  }
});

*/
/* SEND FORM DATA

axios({
  method: "post",
  url: "myurl",
  data: bodyFormData,
  headers: { "Content-Type": "multipart/form-data" },
})
  .then(function (response) {
    //handle success
    console.log(response);
  })
  .catch(function (response) {
    //handle error
    console.log(response);
  });

*/
