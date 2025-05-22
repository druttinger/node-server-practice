const pool = require("./pool");
const { POPULATE } = require("./templates");
const SCHEMA = ["title", "author", "pages", "year", "isbn"];

exports.getAllMessages = async (params = {}, id) => {
  let queryString = `SELECT 
     messages.id AS id, title, username, users.id AS userid, message, email, created_at,
     CASE WHEN users.id = ANY((SELECT friends FROM users WHERE id = $1)::int[]) 
     THEN 'true' ELSE 'false' END AS is_friend,
     CASE WHEN $1 = ANY(users.friends::int[]) 
     THEN 'true' ELSE 'false' END AS has_friended
     FROM messages 
     JOIN users ON messages.authorid = users.id
     WHERE users.id <> ALL ((SELECT block FROM users WHERE id = $1)::int[])`;
  const queryParams = [id];
  let i = 2;
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
  console.log(rows);
  return rows;
};

exports.signUp = async (
  username,
  hashedPassword,
  email,
  firstname,
  lastname,
  status
) => {
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
};

exports.addMessage = async (title, message, authorId) => {
  const { rows } = await pool.query(
    `INSERT INTO messages (title, message, authorid) 
     VALUES ($1, $2, $3) 
     RETURNING id`,
    [title, message, authorId]
  );
  return rows[0].id;
};

exports.getBlockedUsers = async (userid) => {
  const { rows } = await pool.query(
    `SELECT id, username FROM users WHERE 
    id = ANY((SELECT block FROM users WHERE id = $1)::int[])`,
    [userid]
  );
  return rows;
};

exports.blockUser = async (userid, targetid) => {
  const { rows } = await pool.query(
    `UPDATE users SET block = array_append(block, $1) WHERE id = $2 RETURNING *`,
    [targetid, userid]
  );
  return rows[0];
};

exports.unblockUser = async (userid, targetid) => {
  const { rows } = await pool.query(
    `UPDATE users SET block = array_remove(block, $1) WHERE id = $2 RETURNING *`,
    [targetid, userid]
  );
  return rows[0];
};

exports.friendUser = async (userid, targetid) => {
  const { rows } = await pool.query(
    `UPDATE users SET friends = array_append(friends, $1) WHERE id = $2 RETURNING *`,
    [targetid, userid]
  );
  return rows[0];
};

exports.defriendUser = async (userid, targetid) => {
  console.log("Defriend");
  const { rows } = await pool.query(
    `UPDATE users SET friends = array_remove(friends, $1) WHERE id = $2 RETURNING *`,
    [targetid, userid]
  );
  return rows[0];
};

exports.getRowById = async (id) => {
  const { rows } = await pool.query("SELECT * FROM books WHERE id = $1", [id]);
  return rows[0];
};

exports.deleteTitle = async (title) => {
  await pool.query("DELETE FROM books WHERE title = $1", [`"${title}"`]);
};

exports.deleteId = async (id) => {
  await pool.query("DELETE FROM messages WHERE id = $1", [id]);
};

exports.acquireId = async (id, amount = 1, set = false) => {
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
};

exports.deleteAllTitles = async () => {
  await pool.query("DELETE FROM books");
};

exports.repopulate = async () => {
  await pool.query(POPULATE);
};
