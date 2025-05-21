// app.js
const express = require("express");
const session = require("express-session");
const passport = require("passport");
const localAuth = require("./db/localAuth");
const usersRouter = require("./routes/usersRouter");
const path = require("node:path");

const app = express();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

passport.use(localAuth);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    const user = rows[0];

    done(null, user, { message: `Welcome back, ${user.username}!` });
  } catch (err) {
    done(err);
  }
});

app.use(session({ secret: "dogs", resave: false, saveUninitialized: false }));
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use("/", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
