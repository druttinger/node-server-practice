// uncomment when ready to link to database
const db = require("../db/queries");
// const fs = require("fs");

exports.displayGet = async (req, res) => {
  const messages = (await db.getAllMessages()) || [];
  console.log("Messages: ", messages);
  res.render("index", {
    title: "Mini Messageboard",
    messages: messages,
  });
};

// for filtering by name
exports.displayPost = (req, res) => {
  const { name } = req.body;
  res.redirect(`/messages/${name}`);
};

exports.getMessagesById = async (req, res) => {
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
exports.getMessagesbyName = async (req, res) => {
  const messages = (await db.getRowsByName(req.params.name)) || [];
  console.log("Messages: ", messages);
  if (messages.length > 0) {
    res.render("index", {
      title: "Messages from " + req.params.name,
      messages: messages,
    });
  } else {
    res.status(404)
      .send(`I do not have any messages from ${req.params.name} yet, but maybe soon! <br>
        <a href="/">Go back to the homepage</a>`);
  }
};

exports.newMessageGet = (req, res) => {
  res.render("form", { title: "Form" });
};

exports.newMessagePost = async (req, res) => {
  const { author, message } = req.body;
  // const messages = req.app.get("messages") || [];
  db.addMessage(author, message);
  res.redirect("/");
};
