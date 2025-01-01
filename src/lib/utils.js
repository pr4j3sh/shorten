const { postgresHandler } = require("exhandlers");
const crypto = require("crypto");

async function db(text, params, callback) {
  const pool = await postgresHandler(process.env.POSTGRES_URI);
  return pool.query(text, params, callback);
}

async function generateHash(url) {
  const hash = crypto
    .createHash("sha256")
    .update(url)
    .digest("base64url")
    .slice(0, 6);
  return hash;
}

module.exports = { db, generateHash };
