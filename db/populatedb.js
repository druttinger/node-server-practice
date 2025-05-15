#! /usr/bin/env node

const { Client } = require("pg");
const {
  CREATE_AUTHORS_TABLE,
  CREATE_BOOKS_TABLE,
  CREATE_INVENTORY_TABLE,
  INSERT_AUTHORS,
  INSERT_BOOKS,
} = require("./templates");

async function repopulate() {
  const client = new Client({
    connectionString:
      process.env.DATABASE_URL ||
      `postgresql://${process.env.PGNAME}:${process.env.PGPASSWORD}@${process.env.HOST}:${process.env.PGPORT}/${process.env.DATABASE}`,
  });

  try {
    await client.connect();
    console.log("Connected to the database.");

    console.log("Creating authors table...");
    await client.query(CREATE_AUTHORS_TABLE);

    console.log("Creating books table...");
    await client.query(CREATE_BOOKS_TABLE);

    console.log("Creating inventory table...");
    await client.query(CREATE_INVENTORY_TABLE);

    console.log("Inserting authors...");
    await client.query(INSERT_AUTHORS);

    console.log("Inserting books...");
    await client.query(INSERT_BOOKS);

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

repopulate();
