const pool = require("./pool");
const { POPULATE } = require("./templates");

const SCHEMA = ["username", "message", "date"];

async function getAllMessages(params = {}) {
  let queryString = "SELECT * FROM messages";
  const queryParams = [];
  let i = 1;
  for (const key in params) {
    if (key === "date") {
      const date = new Date(params[key]);
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date format");
      }
      queryString += ` ${i === 1 ? "WHERE" : "AND"} added::date = $${i}`;
      queryParams.push(date.toISOString().split("T")[0]);
      i++;
    } else if (SCHEMA.includes(key)) {
      queryString += ` ${i === 1 ? "WHERE" : "AND"} ${key} ILIKE $${i}`;
      queryParams.push(`%${params[key]}%`);
      i++;
    }
  }
  const { rows } = await pool.query(queryString, queryParams);
  return rows;
}

async function getRowsByName(name) {
  const { rows } = await pool.query(
    "SELECT * FROM messages WHERE username ILIKE $1",
    [`%${name}%`]
  );
  return rows;
}

async function getRowById(id) {
  const { rows } = await pool.query("SELECT * FROM messages WHERE id = $1", [
    id,
  ]);
  return rows[0];
}

async function deleteUsername(id) {
  await pool.query("DELETE FROM messages WHERE username = $1", [`"${id}"`]);
}

async function deleteId(id) {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
}

async function deleteAllUsers() {
  await pool.query("DELETE FROM messages");
}

async function repopulate() {
  await pool.query(POPULATE);
}

async function addMessage(name, message) {
  await pool.query("INSERT INTO messages (username, message) VALUES ($1, $2)", [
    name,
    message,
  ]);
}

module.exports = {
  getAllMessages,
  getRowsByName,
  getRowById,
  deleteId,
  deleteAllUsers,
  deleteUsername,
  repopulate,
  addMessage,
};
