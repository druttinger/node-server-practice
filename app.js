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

app.use(session({ secret: "dogs", resave: false, saveUninitialized: false }));
app.use(passport.session());
passport.use(localAuth.strategy);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(localAuth.deserializeUser);

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.post("/signin/", async (req, res, next) => {
  try {
    console.log("test");
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
      failureMessage: true,
      successMessage: true,
    })(req, res, next);
    console.log("test2", req.session);
  } catch (err) {
    return next(err);
  }
});

app.use("/", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express app listening on port ${PORT}!`));
