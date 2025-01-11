const { initPostgres, initRedis } = require("exhandlers");
const crypto = require("crypto");
const { readFileSync } = require("fs");

let pool;

if (process.env.ENV == "dev") {
  pool = initPostgres({
    connectionString: process.env.POSTGRES_URI,
  });
} else {
  pool = initPostgres({
    connectionString: process.env.POSTGRES_URI,
    ssl: {
      rejectUnauthorized: true,
      ca: readFileSync(process.env.POSTGRES_CERT_PATH).toString(),
    },
  });
}

const client = initRedis({
  url: process.env.REDIS_URI,
});

async function generateHash(url) {
  const hash = crypto
    .createHash("sha256")
    .update(url)
    .digest("base64url")
    .slice(0, 6);
  return hash;
}

module.exports = { pool, client, generateHash };
