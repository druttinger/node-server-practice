// const http = require('http');
// const url = require('url');
const fs = require('fs');
const express = require('express');
const app = express()
const indexRouter = require('./routes/indexRouter');
const newRouter = require('./routes/newRouter');

app.set("view engine", "ejs");


app.use("/new", newRouter);
app.use("/", indexRouter);

app.get("/", (req, res) => res.render("index"));
app.get("/:id", (req, res) => {
  if (fs.existsSync(`./views/${req.params.id}`)) {
    res.render(req.params.id);
  } else {
    res.status(404).send("Page not found");
  }
})
  //", (req, res) => res.render("about"));

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`My first Express app - listening on port ${PORT}!`);
});

// http.createServer(function (req, res) {
//   let q = url.parse(req.url, true);
//   console.log(q);
//   let filename = q.pathname === '/' ? './index.html' : "." + q.pathname;
//   console.log(filename);
//   fs.readFile(filename, function(err, data) {
//     if (err) {
//       res.writeHead(404, {'Content-Type': 'text/html'});
//       return res.end("404 Not Found");
//     } 
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write(data);
//     return res.end();
//   });
// }).listen(8080);