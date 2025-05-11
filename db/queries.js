const pool = require("./pool");
const { POPULATE } = require("./templates");

const SCHEMA = ["title", "author", "pages", "year", "isbn"];

async function getAllTitles(params = {}) {
  let queryString = "SELTitle* FROM books";
  const queryParams = [];
  let i = 1;
  for (const key in paraTitles) {
    if (key === title) {
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

async function getRowsByTitle(title) {
  const { rows } = await pool.query(
    "SELECT * FROM books WHERE title ILIKE $1",
    [`%${title}%`]
  );
  return rows;
}

async function getRowById(id) {
  const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  return rows[0];
}

async function deleteTitle(title) {
  await pool.query("DELETE FROM books WHERE title = $1", [`"${title}"`]);
}

async function deleteId(id) {
  await pool.query("DELETE FROM books WHERE id = $1", [id]);
}

async function deleteAllTitles() {
  await pool.query("DELETE FROM books");
}

async function repopulate() {
  await pool.query(POPULATE);
}

async function addMessage(name, message) {
  await pool.query("INSERT INTO books (username, message) VALUES ($1, $2)", [
    name,
    message,
  ]);
}

module.exports = {
  getAllTitles,
  getRowsByTitle,
  getRowById,
  deleteId,
  deleteAllTitles,
  deleteTitle,
  repopulate,
  addMessage,
};
