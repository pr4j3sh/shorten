const {
  errorHandler,
  notFoundHandler,
  logHandler,
  asyncHandler,
  corsHandler,
  postgresHandler,
  disconnectRedis,
  redisHandler,
} = require("exhandlers");
const express = require("express");
const { pool, generateHash, client } = require("./src/lib/utils");
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

    const cache = await client.get(`url:${url}`);
    if (cache) {
      return res.status(200).json({
        success: true,
        code: cache,
      });
    }

    const hash = await generateHash(url);

    const urlExists = await postgresHandler(
      pool,
      "SELECT * FROM urls WHERE code = $1",
      [hash],
    );

    if (urlExists.rows.length > 0) {
      if (urlExists.rows[0].url === url) {
        await client.set(`url:${url}`, hash, "EX", 3600);
        return res.status(200).json({
          success: true,
          code: hash,
        });
      } else {
        const newHash = await generateHash(url + Date.now().toString());
        await postgresHandler(
          pool,
          "INSERT INTO urls(url, code) VALUES($1,$2)",
          [url, newHash],
        );
        await client.set(`url:${url}`, newHash, "EX", 3600);
        return res.status(201).json({
          success: true,
          code: newHash,
        });
      }
    }

    await postgresHandler(pool, "INSERT INTO urls(url, code) VALUES($1,$2)", [
      url,
      hash,
    ]);

    await client.set(`url:${url}`, hash, "EX", 3600);

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

    const cache = await client.get(`code:${code}`);
    if (cache) {
      return res.redirect(cache);
    }

    const result = await postgresHandler(
      pool,
      "SELECT * FROM urls WHERE code = $1",
      [code],
    );
    if (result.rowCount <= 0) {
      throw new Error("Url not found");
    }
    const url = result.rows[0].url;
    await client.set(`code:${code}`, url, "EX", 3600);

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

    const result = await postgresHandler(
      pool,
      "DELETE FROM urls WHERE code = $1",
      [code],
    );
    if (result.rowCount === 0) {
      throw new Error("Url not found");
    }
    const cache = await client.get(`code:${code}`);
    await client.del(`code:${code}`);
    if (cache) {
      await client.del(`url:${cache}`);
    }

    res.status(200).json({
      status: true,
      message: "Url deleted successfully",
    });
  }),
);

server.use(notFoundHandler);
server.use(errorHandler);

server.listen(port, hostname, async () => {
  await redisHandler(client);
  console.log(`server running @ http://${hostname}:${port}`);
});
disconnectRedis(client);
