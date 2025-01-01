const {
  errorHandler,
  notFoundHandler,
  logHandler,
  asyncHandler,
  corsHandler,
} = require("exhandlers");
const express = require("express");
const { db, generateHash } = require("./src/lib/utils");
const { validateUrl, validateCode } = require("./src/middlewares/validations");

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;
const origins = process.env.ORIGINS;

const server = express();

server.use(express.json());
server.use(corsHandler(origins));
server.use(logHandler());

server.get(
  "/api/check",
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      message: "server online",
    });
  }),
);

server.post(
  "/api/shorten",
  validateUrl,
  asyncHandler(async (req, res) => {
    const { url } = req.body;
    // TODO add validation to url
    if (!url) {
      throw new Error("url not defined");
    }

    const hash = await generateHash(url);

    const urlExists = await db("SELECT * FROM urls WHERE code = $1", [hash]);

    if (urlExists.rows.length > 0) {
      if (urlExists.rows[0].url === url) {
        return res.status(200).json({
          status: "success",
          url: hash,
        });
      } else {
        const newHash = await generateHash(url + Date.now().toString());
        await db("INSERT INTO urls(url, code) VALUES($1,$2)", [url, newHash]);
        return res.status(201).json({
          success: true,
          code: newHash,
        });
      }
    }

    await db("INSERT INTO urls(url, code) VALUES($1,$2)", [url, hash]);

    res.status(201).json({
      success: true,
      code: hash,
    });
  }),
);

server.get(
  "/api/:code",
  validateCode,
  asyncHandler(async (req, res) => {
    const code = req.params.code;
    if (!code) {
      throw new Error("code is undefined");
    }

    const result = await db("SELECT * FROM urls WHERE code = $1", [code]);
    if (result.rowCount <= 0) {
      throw new Error("Url not found");
    }
    const url = result.rows[0].url;

    res.redirect(url);
  }),
);

server.delete(
  "/api/:code",
  validateCode,
  asyncHandler(async (req, res) => {
    const code = req.params.code;
    if (!code) {
      throw new Error("code is undefined");
    }

    const result = await db("DELETE FROM urls WHERE code = $1", [code]);
    if (result.rowCount === 0) {
      throw new Error("Url not found");
    }

    res.status(200).json({
      status: true,
      message: "Url deleted successfully",
    });
  }),
);

server.use(notFoundHandler);
server.use(errorHandler);

server.listen(port, hostname, () => {
  console.log(`server running @ http://${hostname}:${port}`);
});
