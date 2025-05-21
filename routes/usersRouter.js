// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.displayGet);
usersRouter.post("/", usersController.displayPost);
usersRouter.post("/signup/", usersController.signUp);
usersRouter.post("/signin/", usersController.signIn);
usersRouter.post("/delete/", usersController.deleteById);
usersRouter.post("/acquire/", usersController.acquireById);
usersRouter.get("/new", usersController.newBookGet);
usersRouter.post("/new/submit", usersController.newBookPost);
usersRouter.get("/new/random", usersController.newRandomBook);
usersRouter.get("/new/random/:subject", usersController.newRandomBook);
usersRouter.use(usersController.notFound);

module.exports = usersRouter;
