const pool = require("./pool");
const { POPULATE } = require("./templates");
const { randomBook, getAuthorBirthday } = require("../controllers/randomBook");
// const { add } = require("date-fns");

const SCHEMA = ["title", "author", "pages", "year", "isbn"];

async function getAllTitles(params = {}) {
  let queryString =
    "SELECT books.id AS id, title, name AS author, pages FROM books JOIN authors ON books.authorid = authors.id";
  const queryParams = [];
  let i = 1;
  for (const key in params) {
    console.log(key, params[key]);
    // if (key === "title") {
    //   const date = new Date(params[key]);
    //   if (isNaN(date.getTime())) {
    //     throw new Error("Invalid date format");
    //   }
    //   queryString += ` ${i === 1 ? "WHERE" : "AND"} added::date = $${i}`;
    //   queryParams.push(date.toISOString().split("T")[0]);
    //   i++;
    // } else
    if (SCHEMA.includes(key)) {
      queryString += ` ${i === 1 ? "WHERE" : "AND"} ${key} ILIKE $${i}`;
      queryParams.push(`%${params[key]}%`);
      i++;
    }
  }
  const { rows } = await pool.query(queryString, queryParams);
  console.log(rows);
  return rows;
}

async function getAuthorId(name) {
  const { rows } = await pool.query(
    "SELECT id FROM authors WHERE name ILIKE $1",
    [name]
  );
  return rows[0] ? rows[0].id : null;
}

async function addAuthor(name) {
  const existingAuthorId = await getAuthorId(name);
  if (existingAuthorId) {
    return existingAuthorId;
  }
  // If the author doesn't exist, fetch their birthdate
  const birthdate = await getAuthorBirthday(name);
  const { rows } = await pool.query(
    "INSERT INTO authors (name, birthdate) VALUES ($1, $2) RETURNING id",
    [name, birthdate]
  );
  return rows[0].id;
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

async function addBook(title, author, year, pages = unknown, isbn = unknown) {
  const authorId = await addAuthor(author);
  const { rows } = await pool.query(
    "INSERT INTO books (title, authorid, pages, year, isbn) VALUES ($1, $2, $3, $4, $5) RETURNING id",
    [title, authorId, pages, year, isbn]
  );
  return rows[0].id;
}

async function addRandomBook() {
  const { title, author, year } = await randomBook();
  const authorId = await addAuthor(author);
  console.log(title, author, authorId, year);
  const { rows } = await pool.query(
    "INSERT INTO books (title, authorid, year) VALUES ($1, $2, $3) RETURNING id",
    [title, authorId, year]
  );
  return rows[0].id;
}

module.exports = {
  getAllTitles,
  getRowsByTitle,
  getRowById,
  deleteId,
  deleteAllTitles,
  deleteTitle,
  repopulate,
  addBook,
  addRandomBook,
  addAuthor,
};
