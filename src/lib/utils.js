const { initPostgres, initRedis } = require("exhandlers");
const crypto = require("crypto");

const pool = initPostgres(process.env.POSTGRES_URI);
const client = initRedis(process.env.REDIS_URI);

async function generateHash(url) {
  const hash = crypto
    .createHash("sha256")
    .update(url)
    .digest("base64url")
    .slice(0, 6);
  return hash;
}

module.exports = { pool, client, generateHash };
