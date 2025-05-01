const pool = require("./pool");
const { POPULATE } = require("./templates");

async function getAllMessages() {
  const { rows } = await pool.query("SELECT * FROM messages");
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
  deleteAllUsers,
  deleteUsername,
  repopulate,
  addMessage,
};
