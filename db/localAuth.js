const LocalStrategy = require("passport-local").Strategy;
const pool = require("./pool");
const bcrypt = require("bcryptjs");

module.exports.strategy = new LocalStrategy(
  async (username, password, done) => {
    try {
      console.log("What is going on?");
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
