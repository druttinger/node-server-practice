const db = require("../db/queries");
// const { randomBook } = require("./randomBook");

exports.displayGet = async (req, res) => {
  const books = (await db.getAllTitles(req.query)) || [];
  // the following line is for testing purposes
  // let yesterdayMessage = randomMessage();
  // yesterdayMessage = {
  //   ...yesterdayMessage,
  //   username: yesterdayMessage.author,
  //   added: new Date(Date.now() - 24 * 60 * 60 * 1000),
  // };
  // messages.push(yesterdayMessage);
  res.render("index", {
    title: "Mini Library",
    origin: req.query.message || "",
    books: books,
  });
};

// for filtering by name
exports.displayPost = (req, res) => {
  const { name } = req.body;
  res.redirect(`/messages/${name}`);
};

exports.deleteById = async (req, res) => {
  const id = +req.body.id;
  await db.deleteId(id);
  res.redirect("/");
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

exports.getMessagesbyName = async (req, res, next) => {
  console.log(req.originalUrl, req.url, req.path);
  const url = new URL(req.originalUrl);
  console.log("URL: ", url);
  const searchParams = url.searchParams;
  searchParams.append("name", req.params.name);
  req.url = url.pathname + "?" + searchParams.toString();
  console.log("New URL: ", req.url);
  next();
};

exports.newMessageGet = (req, res) => {
  res.render("form", { title: "Form" });
};

exports.newMessagePost = async (req, res) => {
  const { author, message } = req.body;
  // const messages = req.app.get("messages") || [];
  db.addBook(author, message);
  res.redirect("/");
};

exports.newRandomBook = async (req, res) => {
  await db.addRandomBook();
  res.redirect("/");
};

exports.newKristiePost = async (req, res) => {
  const { author, message } = randomMessage(true);
  // const messages = req.app.get("messages") || [];
  db.addBook(author, message);
  res.redirect("/");
};

exports.notFound = (req, res) => {
  res.status(404).send("404 Not Found");
};
