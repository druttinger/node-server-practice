const { Pool } = require("pg");

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool({
  host: "localhost", // or wherever the db is hosted
  user: process.env.PGNAME,
  database: "top_users",
  password: process.env.PGPASSWORD, // The password for the database
  port: process.env.PGPORT, // The default port
});
