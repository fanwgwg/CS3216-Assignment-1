const express = require('express');
const app = express();

const port = process.env.port || process.env.PORT || 8000

app.get('/', function (req, res) {
  res.send('Hello World!')
});

app.listen(port, function () {
  console.log("Server listening on port %s", port);
});
