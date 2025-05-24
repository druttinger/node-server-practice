const db = require("../db/queries");
const bcrypt = require("bcryptjs");

const keepParams = (req) => {
  const requestData = new URLSearchParams(req.query);
  return requestData.toString();
};

exports.displayGet = async (req, res) => {
  const messages =
    (await db.getAllMessages(req.query, req.user?.id || 0)) || [];
  const blocked = req.user ? await db.getBlockedUsers(req.user.id) : [];
  res.render("index", {
    title: "Members Only Message Board",
    messages: messages || false,
    authMessage: req.session?.messages?.at(-1) || req.session?.message || "",
    user: req.user || false,
    blocked: blocked || [],
  });
};

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

exports.signOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};

exports.blockUser = async (req, res) => {
  if (+req.user?.id === +req.body.target) {
    req.session.message = "You cannot block yourself!";
    return res.redirect("/?" + keepParams(req));
  }
  req.session.message = "Blocked!";
  await db.blockUser(req.user.id, req.body.target);
  res.redirect("/?" + keepParams(req));
};

exports.unblockUser = async (req, res) => {
  req.session.message = "Unblocked!";
  await db.unblockUser(req.user.id, req.body.target);
  res.redirect("/?" + keepParams(req));
};

exports.friendUser = async (req, res) => {
  if (+req.user?.id === +req.body.target) {
    req.session.message = "You cannot friend yourself!";
    return res.redirect("/?" + keepParams(req));
  }
  req.session.message = "Friended!";
  await db.friendUser(req.user.id, req.body.target);
  res.redirect("/?" + keepParams(req));
};

exports.defriendUser = async (req, res) => {
  req.session.message = "Defriended!";
  await db.defriendUser(req.user.id, req.body.target);
  res.redirect("/?" + keepParams(req));
};

// for filtering by name
exports.displayPost = (req, res) => {
  const { name } = req.body;
  res.redirect(`/messages/${name}`);
};

exports.deleteById = async (req, res) => {
  if (req.user?.status === "admin" || req.user?.username === req.body.creator) {
    const id = +req.body.target;
    await db.deleteId(id);
    req.session.message = "Deleted!";
  } else {
    req.session.message = "You do not have permission to delete this message!";
  }
  res.redirect("/?" + keepParams(req));
};

exports.submitMessage = async (req, res) => {
  const { title, message } = req.body;
  console.log(req.user?.id ? req.user.id : 0);
  if (!req.user) {
    req.session.message = "You must be logged in to post a message!";
    return res.redirect("/?" + keepParams(req));
  }
  const userid = req.user.id ? req.user.id : 0;
  const id = await db.addMessage(title, message, userid);
  res.redirect("/?" + keepParams(req));
};

exports.notFound = (req, res) => {
  res.status(404).send("404 Not Found");
};
