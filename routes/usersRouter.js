// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.displayGet);
usersRouter.post("/", usersController.displayPost);
usersRouter.get("/messages:id", usersController.getMessagesById);
usersRouter.get("/messages/:name", usersController.getMessagesbyName);
usersRouter.get("/new", usersController.newMessageGet);
usersRouter.post("/new/submit", usersController.newMessagePost);

module.exports = usersRouter;
