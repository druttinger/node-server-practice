const { Pool } = require("pg");

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool(
  process.env.REMOTE
    ? { connectionString: process.env.DATABASE_URL }
    : {
        host: process.env.HOST, // or wherever the db is hosted
        user: process.env.PGNAME,
        database: process.env.DATABASE, // The name of the database
        password: process.env.PGPASSWORD, // The password for the database
        port: process.env.PGPORT, // The default port
      }
);
