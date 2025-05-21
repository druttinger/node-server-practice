const pool = require("./pool");
const { POPULATE } = require("./templates");
const { randomBook, getAuthorBirthday } = require("../controllers/randomBook");
const SCHEMA = ["title", "author", "pages", "year", "isbn"];

async function getAllMessages(params = {}) {
  let queryString = `SELECT 
     messages.id AS id, title, username, message
     FROM messages 
     JOIN users ON messages.authorid = users.id`;
  const queryParams = [];
  let i = 1;
  for (const key in params) {
    if (key === "year") {
      queryString += ` ${i === 1 ? "WHERE" : "AND"} ${key} = $${i}`;
      queryParams.push(`${params[key]}`);
      i++;
    } else if (key === "author") {
      queryString += ` ${i === 1 ? "WHERE" : "AND"} authors.name = $${i}`;
      queryParams.push(`${params[key]}`);
      i++;
    } else if (SCHEMA.includes(key)) {
      queryString += ` ${i === 1 ? "WHERE" : "AND"} ${key}::text ILIKE $${i}`;
      queryParams.push(`%${params[key]}%`);
      i++;
    }
  }
  const { rows } = await pool.query(queryString, queryParams);
  return rows;
}

async function signUp(
  username,
  hashedPassword,
  email,
  firstname,
  lastname,
  status
) {
  await pool.query(
    `INSERT INTO users (username, password, email, firstname, lastname, status) 
      VALUES ($1, $2, $3, $4, $5, $6)`,
    [
      username,
      hashedPassword,
      email,
      firstname || "",
      lastname || "",
      status || "none",
    ]
  );
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
  await pool.query("DELETE FROM inventory WHERE bookid = $1", [id]);
  await pool.query("DELETE FROM books WHERE id = $1", [id]);
}

async function acquireId(id, amount = 1, set = false) {
  // determine if we are setting or adding to the quantity
  const setString = set ? "" : "inventory.quantity +";
  const { rows } = await pool.query(
    `INSERT INTO inventory (bookid, quantity) 
     VALUES ($1, GREATEST (0, $2))
     ON CONFLICT (bookid)
     DO UPDATE SET
     quantity = GREATEST(0, 
     ${setString} $2)
     RETURNING *`,
    [id, amount]
  );
  return rows[0];
}

async function deleteAllTitles() {
  await pool.query("DELETE FROM books");
}

async function repopulate() {
  await pool.query(POPULATE);
}

async function addBook(
  title,
  author,
  year = 0,
  pages = "unknown",
  isbn = "unknown"
) {
  const authorId = await addAuthor(author);
  const { rows } = await pool.query(
    `INSERT INTO books (title, authorid, pages, year, isbn) 
     VALUES ($1, $2, $3, $4, $5) 
     ON CONFLICT (title) 
     DO UPDATE SET
     authorid = $2, pages = $3, year = $4, isbn = $5
     RETURNING id`,
    [title, authorId, pages, year, isbn]
  );
  return rows[0].id;
}

async function addRandomBook(subject = "fantasy") {
  let rowCount;
  do {
    const {
      title = "Unknown",
      author = "Unknown",
      year = 0,
    } = await randomBook(subject);
    const authorId = await addAuthor(author);
    ({ rowCount } = await pool.query(
      "INSERT INTO books (title, authorid, year) VALUES ($1, $2, $3) ON CONFLICT DO NOTHING",
      [title, authorId, year]
    ));
  } while (rowCount === 0);
}

module.exports = {
  getAllMessages,
  signUp,
  getRowsByTitle,
  getRowById,
  deleteId,
  deleteAllTitles,
  deleteTitle,
  repopulate,
  addBook,
  addRandomBook,
  addAuthor,
  acquireId,
};
