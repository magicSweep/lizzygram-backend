const express = require("express");
const multer = require("multer");
const { createReadStream } = require("fs");
const { resolve } = require("path");
const cors = require("cors");

const pathToPhoto = resolve(process.cwd(), "src", "static", "12.jpg");
const uploadDir = resolve(process.cwd(), "upload");

const upload = multer({ dest: uploadDir });

const app_ = () => {
  const app = express();

  app.use(
    cors({
      origin: [
        "http://192.168.1.82:8080",
        "http://127.0.0.1:8080",
        "http://localhost:8080",
        "http://localhost:8000",
        "https://lizzygram.netlify.app",
        "https://photo-boom.vercel.app",
      ],
      methods: "POST,OPTIONS",
    })
  );

  app.get("/", (req, res, next) => {
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
          <a download="hello.jpg" href="http://localhost:3009/download/123r34ewrds/hello.jpeg">Download file</a>
      </body>
      </html>
    `);
  });

  return app;
};

const app = app_();

const server = app.listen(8000, () => {
  console.log(`> Ready on port: ${8000}`);
});
