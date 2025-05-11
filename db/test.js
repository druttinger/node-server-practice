#! /usr/bin/env node

const { Client } = require("pg");

async function test() {
  const client = new Client({
    connectionString: `postgresql://${process.env.PGNAME}:${process.env.PGPASSWORD}@${process.env.HOST}:${process.env.PGPORT}/${process.env.DATABASE}`,
  });

  try {
    await client.connect();
    console.log("Connected to the database.");

    const { rows } = await client.query("SELECT * FROM books");
    console.log("Current books in the database:", rows);

    console.log("Database seeded successfully.");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await client.end();
    console.log("Connection closed.");
  }
}

test();
