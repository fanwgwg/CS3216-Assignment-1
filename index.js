const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000;

app.use(express.static(__dirname));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', function (req, res) {
    res.render("./index.html");
});

app.listen(port, function () {
    console.log("Server listening on port %s", port);
});