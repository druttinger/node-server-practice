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
  console.log("blocked", blocked, req.user);
  res.render("index", {
    title: "Members Only Message Board",
    messages: messages || false,
    authMessage: req.session?.messages?.at(-1) || req.session?.message || "",
    user: req.user || false,
    blocked: blocked || [],
  });
};

// TODO: update to use encryption
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

// Moved to app.js
// exports.signIn = async (req, res, next) => {
//   try {
//     passport.authenticate("local", {
//       successRedirect: "/",
//       failureRedirect: "/",
//       failureMessage: true,
//       successMessage: true,
//     });
//   } catch (err) {
//     return next(err);
//   }
// };

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

exports.acquireById = async (req, res) => {
  const id = +req.body.id;
  const amount = req.body.amount ? +req.body.amount : 1;
  await db.acquireId(id, amount);
  res.redirect("/?" + keepParams(req));
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

exports.newBookGet = (req, res) => {
  res.render("form", { title: "Form" });
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

exports.newBookPost = async (req, res) => {
  const { title, author, pages, year, isbn, quantity } = req.body;
  const id = await db.addBook(title, author, year, pages, isbn);
  if (quantity !== undefined && quantity >= 0) {
    await db.acquireId(id, quantity, true);
  }
  res.redirect("/?" + keepParams(req));
};

exports.newRandomBook = async (req, res) => {
  const subject = req.params.subject || "fantasy";
  await db.addRandomBook(subject);
  res.redirect("/?" + keepParams(req));
};

exports.notFound = (req, res) => {
  res.status(404).send("404 Not Found");
};
