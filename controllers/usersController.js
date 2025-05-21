const db = require("../db/queries");
const bcrypt = require("bcryptjs");
// const { randomBook } = require("./randomBook");

const keepParams = (req) => {
  const requestData = new URLSearchParams(req.query);
  return requestData.toString();
};

exports.displayGet = async (req, res) => {
  const messages = (await db.getAllMessages(req.query)) || [];
  res.render("index", {
    title: "Members Only Message Board",
    messages: messages || false,
    user: req.user || false,
  });
};

// TODO: update to use encryption
exports.signUp = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(
      req.body.password,
      +process.env.SALT
    );
    await db.signUp(
      req.body.username,
      hashedPassword,
      req.body.email,
      req.body.firstname || "",
      req.body.lastname || "",
      req.body.status || "none"
    );
    res.redirect("/");
  } catch (err) {
    return next(err);
  }
};

// TODO: Update this to sign in
exports.signIn = async (req, res, next) => {
  try {
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/",
    });
  } catch (err) {
    return next(err);
  }
};

// for filtering by name
exports.displayPost = (req, res) => {
  const { name } = req.body;
  res.redirect(`/messages/${name}`);
};

exports.deleteById = async (req, res) => {
  const id = +req.body.id;
  await db.deleteId(id);
  res.redirect("/?" + keepParams(req));
};

exports.acquireById = async (req, res) => {
  const id = +req.body.id;
  const amount = req.body.amount ? +req.body.amount : 1;
  await db.acquireId(id, amount);
  res.redirect("/?" + keepParams(req));
};

exports.getTitlesById = async (req, res) => {
  const message = await db.getRowById(req.params.id);
  if (message) {
    res.render("message", {
      title: "My Message",
      message: message,
    });
  } else if (+req.params.id === 0) {
    res.status(404).send(`Lowest valid message index is 1! <br>
        <a href="/">Go back to the homepage</a>`);
  } else {
    res.status(404)
      .send(`I do not have ${req.params.id} message(s) yet, but maybe soon! <br>
        <a href="/">Go back to the homepage</a>`);
  }
};

exports.newBookGet = (req, res) => {
  res.render("form", { title: "Form" });
};

exports.newBookPost = async (req, res) => {
  const { title, author, pages, year, isbn, quantity } = req.body;
  const id = await db.addBook(title, author, year, pages, isbn);
  if (quantity !== undefined && quantity >= 0) {
    await db.acquireId(id, quantity, true);
  }
  res.redirect("/?" + keepParams(req));
};

exports.newRandomBook = async (req, res) => {
  const subject = req.params.subject || "fantasy";
  await db.addRandomBook(subject);
  res.redirect("/?" + keepParams(req));
};

exports.notFound = (req, res) => {
  res.status(404).send("404 Not Found");
};
