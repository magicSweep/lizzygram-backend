import axios from "axios";
import { createWriteStream } from "fs";
import FormData from "form-data";

type RequestOptions = {
  headers: { [title: string]: string };
  // `params` are the URL parameters to be sent with the request
  // Must be a plain object or a URLSearchParams object
  params: { [paramName: string]: string | number };
  // `data` is the data to be sent as the request body
  // Only applicable for request methods 'PUT', 'POST', 'DELETE , and 'PATCH'
  // When no `transformRequest` is set, must be of one of the following types:
  // - string, plain object, ArrayBuffer, ArrayBufferView, URLSearchParams
  // - Browser only: FormData, File, Blob
  // - Node only: Stream, Buffer
  /* data: {
    firstName: "Fred";
  }; */
  timeout: 1000;
  // `responseType` indicates the type of data that the server will respond with
  // options are: 'arraybuffer', 'document', 'json', 'text', 'stream'
  //   browser only: 'blob'
  responseType?: "json"; // default
  responseEncoding: "utf8";

  // `cancelToken` specifies a cancel token that can be used to cancel the request
  // (see Cancellation section below for details)
  //cancelToken: new CancelToken(function (cancel) {}),

  // an alternative way to cancel Axios requests using AbortController
  //signal: new AbortController().signal,
};

type Response = {
  // `data` is the response that was provided by the server
  data: {};

  // `status` is the HTTP status code from the server response
  status: 200;

  // `statusText` is the HTTP status message from the server response
  statusText: "OK";

  // `headers` the HTTP headers that the server responded with
  // All header names are lower cased and can be accessed using the bracket notation.
  // Example: `response.headers['content-type']`
  headers: {};
};

type IRequest = {
  get: () => any;
  post: () => any;
};

// url - '/user?ID=12345'
export const get = (url: string, options: RequestOptions = {} as any) => {
  return axios({
    method: "get",
    url,
    ...options,
  });
};

export const postFormData = (
  url: string,
  data: FormData
  //options: RequestOptions = {} as any
) => {
  //const headers = options.headers !== undefined ? options.headers : {};
  //headers["Content-Type"] = "multipart/form-data";

  return axios({
    method: "post",
    url,
    data,
    headers: data.getHeaders(),
  });
};

export const getStream = (
  url: string,
  pathToFile: string,
  options: RequestOptions = {} as any
) =>
  new Promise((resolve, reject) => {
    const writeStream = createWriteStream(pathToFile);

    writeStream.on("finish", () => {
      resolve(true);
    });

    writeStream.on("error", (err) => {
      reject(err.message);
    });

    axios({
      method: "get",
      url,
      responseType: "stream",
      ...options,
    }).then((response) => {
      //console.log("RESPONSE", response.status, response.statusText);
      //console.log("RESPONSE HEADERS", response.headers);
      response.data.pipe(writeStream);
    });
  });

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
