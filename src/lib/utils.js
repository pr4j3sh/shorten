const { postgresHandler } = require("exhandlers");

const pool = postgresHandler(process.env.POSTGRES_URI);

module.exports = { pool };
