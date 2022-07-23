const { Pool } = require("pg");
exports.pool = new Pool({
  user: "postgres",
  database: "pokedex",
  password: "123456789",
});
