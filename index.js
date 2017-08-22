const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000

const mysql = require('mysql');
// const config = require('./config');

// const mysqlCon = mysql.createConnection(config.MYSQL_OPTIONS);

// mysqlCon.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected!");
// });

function loadJsonFromFile(jsonPath, req, res) {
  fs.readFile(jsonPath, function (err, data) {
    if (err) {
      res.end(err.message);
    } else {
      res.writeHead(200, {
        "Content-Type": "application/json"
      });
      res.end(data.toString());
    }
  });
}

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.render("index.html");
});

app.get('/questions', function (req, res) {
  loadJsonFromFile("./src/questions.json", req, res);
});

app.listen(port, function () {
  console.log("Server listening on port %s", port);
});