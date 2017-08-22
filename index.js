const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000

const mysql = require('mysql');
const config = require('./config');

const mysqlCon = mysql.createConnection(config.MYSQL_OPTIONS);

mysqlCon.connect(function(err) {
  if (err) throw err;
  console.log("Connected!");
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.render("index.html");
});

app.listen(port, function () {
  console.log("Server listening on port %s", port);
});
