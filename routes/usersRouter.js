// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();
const { validateUser, checkRules } = require("../db/localAuth");
const { body } = require("express-validator");

// "signin" is handled in app.js
usersRouter.get("/", usersController.displayGet);
usersRouter.post("/", usersController.displayPost);
usersRouter.post("/signup/", validateUser, checkRules, usersController.signUp);
// usersRouter.post("/signup/", validateUser, checkRules, usersController.signUp);
usersRouter.post("/signout/", usersController.signOut);
usersRouter.post("/delete/", usersController.deleteById);
usersRouter.post("/submit/", usersController.submitMessage);
usersRouter.post("/block/", usersController.blockUser);
usersRouter.post("/unblock/", usersController.unblockUser);
usersRouter.post("/friend/", usersController.friendUser);
usersRouter.post("/defriend/", usersController.defriendUser);
usersRouter.use(usersController.notFound);

module.exports = usersRouter;
