const { postgresHandler } = require("exhandlers");

async function db(text, params, callback) {
  const pool = await postgresHandler(process.env.POSTGRES_URI);
  return pool.query(text, params, callback);
}

module.exports = { db };
