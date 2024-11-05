const {
  errorHandler,
  notFoundHandler,
  logHandler,
  asyncHandler,
} = require("exhandlers");
const express = require("express");

const port = process.env.PORT;
const hostname = process.env.HOSTNAME;

const server = express();

server.use(express.json());
server.use(logHandler);

server.get(
  "/api/check",
  asyncHandler(async (req, res) => {
    res.status(200).json({
      success: true,
      message: "server online",
    });
  }),
);

const db = [];

async function count() {
  const i = db.length + 1;
  return i.toString();
}

async function upload(url) {
  const id = await count();
  const obj = { id, url };
  console.log(obj);
  db.push(obj);
  return id;
}

server.post(
  "/api/url",
  asyncHandler(async (req, res) => {
    const { url } = req.body;
    if (!url) {
      throw new Error("url not defined");
    }
    console.log({ url });
    const id = await upload(url);

    res.status(201).json({
      success: true,
      url: `${req.protocol}://${req.get("host")}/${id}`,
    });
  }),
);

async function download(id) {
  const obj = db.find((item) => item.id === id);
  return obj ? obj.url : null;
}

server.get(
  "/api/:id",
  asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!id) {
      throw new Error("id is undefined");
    }
    const url = await download(id);
    if (!url) {
      throw new Error("Url not found");
    }
    console.log({ url });
    res.redirect(url);
  }),
);

server.use(notFoundHandler);
server.use(errorHandler);

server.listen(port, hostname, () => {
  console.log(`server running @ http://${hostname}:${port}`);
});
