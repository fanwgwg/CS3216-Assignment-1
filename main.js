const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000

const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool(config.MYSQL_OPTIONS);

function loadJsonFromFile(jsonPath, req, res) {
  fs.readFile(jsonPath, function(err, data) {
    if (err) {
      res.end(err.message);
    } else {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data.toString());
    }
  });
}

pool.getConnection(function(err, connection) {
  if (err) throw err;
  console.log("Database Connected: %s", connection);
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.render("./index.html");
});

app.get('/questions', function (req, res) {
  loadJsonFromFile("./resources/mock-data/questions.json", req, res);
});

app.listen(port, function () {
  console.log("Server listening on port %s", port);
});