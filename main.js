const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000
const mysql = require('mysql');
const config = require('./config.js');
const pool = mysql.createPool(config.DBOPTIONS);

pool.getConnection(function (err, connection) {
  if (err) throw err;
  console.log("Database Connected: %s", connection);
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.render("./index.html");
});

app.get('/questions', function (req, res) {
  // stub
  // loadJsonFromFile("./resources/mock-data/questions.json", req, res);

  // from database
  pool.query(`SELECT * FROM Teamker.questions
              WHERE page_id='page_id'
              ORDER BY 'index';`, function (error, results, fields) {
    if (error) {
      console.log(error.message);
      res.end(err.message);
    }
    else {
      let data = { questions: [] };
      results.forEach(function(row) {
        data.questions.push({"body": row.attribute});
      });
      data = JSON.stringify(data);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(data);
    }
  });
});

app.listen(port, function () {
  console.log("Server listening on port %s", port);
});

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

function parseUserData() {
  let users = [];
  pool.query(`SELECT users.id, users.name, users.desc, GROUP_CONCAT(responses.score) AS attributes
              FROM users
              INNER JOIN responses ON users.id = responses.user_id
              WHERE responses.page_id = 'page_id'
              GROUP BY users.id;`, function (error, results, fields) {
    if (error) throw error;
    else {
      results.forEach(function(row) {
        users.push(Object.assign({}, row, {attributes: row.attributes.split(',').map(Number)}));
      });
    }
  });
  return users;
}