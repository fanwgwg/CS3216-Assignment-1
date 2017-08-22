const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000

const mysql = require('mysql');
const config = require('./config');

const pool = mysql.createPool(config.MYSQL_OPTIONS);

pool.getConnection(function(err, connection) {
  if (err) throw err;
  console.log("Database Connected: %s", connection);
});

app.use(express.static(__dirname));

app.get('/', function (req, res) {
  res.render("./index.html");
});

app.listen(port, function () {
  console.log("Server listening on port %s", port);
});
