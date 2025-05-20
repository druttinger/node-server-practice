#! /usr/bin/env node

const { Client } = require("pg");
const { CREATE_USERS_TABLE, CREATE_MESSAGES_TABLE } = require("./templates");

async function repopulate() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.PGNAME}:${process.env.PGPASSWORD}@${process.env.HOST}:${process.env.PGPORT}/${process.env.DATABASE}`,
  });

  try {
    await client.connect();
    console.log("Connected to the database.");

    console.log("Creating USERS table...");
    await client.query(CREATE_USERS_TABLE);

    console.log("Creating messages table...");
    await client.query(CREATE_MESSAGES_TABLE);

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

repopulate();
