const http = require('http');
const url = require('url');
const fs = require('fs');

console.log("Something");

http.createServer(function (req, res) {
  let q = url.parse(req.url, true);
  console.log(q);
  let filename = q.pathname === '/' ? './index.html' : "." + q.pathname;
  console.log(filename);
  fs.readFile(filename, function(err, data) {
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'});
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'});
    res.write(data);
    return res.end();
  });
}).listen(8080);