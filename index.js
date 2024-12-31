const {
  errorHandler,
  notFoundHandler,
  logHandler,
  asyncHandler,
  corsHandler,
} = require("exhandlers");
const express = require("express");

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
  asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) {
      throw new Error("url not defined");
    }

    res.status(201).json({
      success: true,
      url: "short url",
    });
  }),
);

server.get(
  "/api/:code",
  asyncHandler(async (req, res) => {
    const code = req.params.code;
    if (!code) {
      throw new Error("code is undefined");
    }

    // res.redirect(url);
  }),
);

server.delete(
  "/api/:code",
  asyncHandler(async (req, res) => {
    const code = req.params.code;
    if (!code) {
      throw new Error("code is undefined");
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
