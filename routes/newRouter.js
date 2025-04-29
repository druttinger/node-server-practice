const express = require("express");
const newRouter = express.Router();

newRouter.get("/", (req, res) => res.render("form", { title: "Form" }));

newRouter.post("/submit", async (req, res) => {
  const { author, message } = req.body;
  const messages = req.app.get("messages");
  messages.push({ text: message, user: author, added: new Date() });
  res.redirect("../");
});

// Export both newRouter and messages
module.exports = newRouter;
