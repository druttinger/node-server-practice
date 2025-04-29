const express = require("express");
const indexRouter = express.Router();
const fs = require("fs");

indexRouter.get("/", (req, res) => {
  const messages = req.app.get("messages");
  res.render("index", { title: "Mini Messageboard", messages: messages });
});

indexRouter.get("/messages:id", (req, res) => {
  const messages = req.app.get("messages");
  if (req.params.id < messages.length) {
    res.render("message", {
      title: "My Message",
      message: messages[req.params.id],
    });
  } else {
    res.status(404)
      .send(`I do not have ${req.params.id} message(s) yet, but maybe soon! <br>
        <a href="/">Go back to the homepage</a>`);
  }
});

indexRouter.get("/messages:id", (req, res) => {
  if (fs.existsSync(`./views/${req.params.id}`)) {
    res.render(req.params.id);
  } else {
    res
      .status(404)
      .send(
        `I do not know anything about ${req.params.id} yet, but I would love to learn!`
      );
  }
});

indexRouter.get("/:id", (req, res) => {
  if (fs.existsSync(`./views/${req.params.id}`)) {
    res.render(req.params.id);
  } else {
    res
      .status(404)
      .send(
        `I do not know anything about ${req.params.id} yet, but I would love to learn!`
      );
  }
});

indexRouter.get("/", (req, res) => {
  res.render("Hello World");
});

indexRouter.post("/", (req, res) => {
  const { name } = req.body;
  res.send(`Hello ${name}`);
});

module.exports = indexRouter;
