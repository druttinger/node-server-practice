const LocalStrategy = require("passport-local").Strategy;
const pool = require("./pool");
const bcrypt = require("bcryptjs");
const { body, validationResult, matchedData } = require("express-validator");
const db = require("./queries");

module.exports.strategy = new LocalStrategy(
  async (username, password, done) => {
    try {
      const { rows } = await pool.query(
        "SELECT * FROM users WHERE username = $1",
        [username]
      );
      const user = rows[0];

      if (!user) {
        return done(null, false, { message: "Incorrect username" });
      }
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        return done(null, false, { message: "Incorrect password" });
      }
      return done(null, user, {
        message: `Welcome back, ${user.username}!`,
      });
    } catch (err) {
      return done(err);
    }
  }
);

module.exports.deserializeUser = async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user, { message: `Welcome back, ${user.username}!` });
  } catch (err) {
    done(err);
  }
};

module.exports.validateUser = [
  body("email")
    .optional({ values: "falsy" })
    .isEmail()
    .withMessage("E-mail is not valid")
    .custom(async (value) => {
      const user = await findUserByField("email", value);
      if (user) {
        throw new Error("E-mail already in use");
      }
    }),
  body("username")
    .notEmpty()
    .withMessage("Username is required")
    .custom(async (value) => {
      const user = await findUserByField("username", value);
      if (user) {
        throw new Error("Username already in use");
      }
    }),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 4 })
    .withMessage("Password must be at least 4 characters long")
    .custom((value, { req }) => {
      if (value !== req.body.password2) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
];

module.exports.checkRules = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

const findUserByField = async (field, value) => {
  const { rows } = await pool.query(`SELECT * FROM users WHERE $1 = $2`, [
    field,
    value,
  ]);
  return rows[0];
};
