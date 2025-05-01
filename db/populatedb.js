#! /usr/bin/env node

const { Client } = require("pg");

export const populateSQL = `
CREATE TABLE IF NOT EXISTS usernames (
  id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  username VARCHAR ( 255 )
);
`;

async function repopulate() {
  console.log("seeding...");
  const client = new Client({
    connectionString: `postgresql://${process.env.PGNAME}:${process.env.PGPASSWORD}@localhost:${process.env.PGPORT}/top_users`,
  });
  await client.connect();
  await client.query(populateSQL);
  await client.end();
  console.log("done");
}

repopulate();
