const express = require("express");
const multer = require("multer");
const { createReadStream } = require("fs");
const { resolve } = require("path");

const pathToPhoto = resolve(process.cwd(), "src", "static", "12.jpg");
const uploadDir = resolve(process.cwd(), "upload");

const upload = multer({ dest: uploadDir });

const app_ = () => {
  const app = express();

  /* app.get("/", (req, res, next) => {
    res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <script src="/app.js"></script>
          <link rel="stylesheet" href="/styles.css">
          <title>My server</title>
      </head>
      <body>
          <h1>My server</h1>
          <a download="hello.jpg" href="/download">Download file</a>
      </body>
      </html>
    `);
  }); */

  app.post("/file", upload.single("photoFile"), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    res.status(200).json({
      status: "success",
      data: {
        ...req.body,
        filename: req.file.filename,
      },
    });
  });

  app.get("/download/:id/:name", (req, res, next) => {
    console.log("-----------DOWNLOAD", req.params);
    const photoStream = createReadStream(pathToPhoto);

    res.type("application/octet-stream");
    //res.type("image/jpeg");
    res.setHeader("Transfer-Encoding", "chunked");

    //photoStream.pipe(res);
    // res.setHeader("Transfer-Encoding", "chunked");

    photoStream
      .on("data", (data_) => {
        res.write(data_);
      })
      .on("error", (err) => {
        console.error("Error downloading file from Google drive.", err);

        res.end();
      })
      .on("end", () => {
        //console.log("Done downloading file from Google drive.");
        res.end();
      });
  });

  return app;
};

const app = app_();

const server = app.listen(3009, () => {
  console.log(`> Ready on port: ${3009}`);
});
