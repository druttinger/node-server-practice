// routes/usersRouter.js
const { Router } = require("express");
const usersController = require("../controllers/usersController");
const usersRouter = Router();

usersRouter.get("/", usersController.displayGet);
usersRouter.post("/", usersController.displayPost);
usersRouter.post("/signup/", usersController.signUp);
usersRouter.post("/signout/", usersController.signOut);
// usersRouter.post("/signin/", usersController.signIn);
usersRouter.post("/delete/", usersController.deleteById);
usersRouter.post("/acquire/", usersController.acquireById);
usersRouter.post("/submit/", usersController.submitMessage);
usersRouter.post("/block/", usersController.blockUser);
usersRouter.post("/unblock/", usersController.unblockUser);
usersRouter.post("/friend/", usersController.friendUser);
usersRouter.post("/defriend/", usersController.defriendUser);
// usersRouter.post("/new/submit", usersController.newBookPost);
// usersRouter.get("/new/random", usersController.newRandomBook);
// usersRouter.get("/new/random/:subject", usersController.newRandomBook);
usersRouter.use(usersController.notFound);

module.exports = usersRouter;
