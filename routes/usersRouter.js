// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.displayGet);
usersRouter.post("/", usersController.displayPost);
usersRouter.post("/delete/", usersController.deleteById);
// usersRouter.get("/messages:id", usersController.getMessagesById);
// usersRouter.get("/messages/:name", usersController.getMessagesbyName);
usersRouter.get("/new", usersController.newMessageGet);
usersRouter.post("/new/submit", usersController.newMessagePost);
usersRouter.get("/new/random", usersController.newRandomPost);
usersRouter.get("/new/kristie", usersController.newKristiePost);
usersRouter.use(usersController.notFound);

module.exports = usersRouter;
