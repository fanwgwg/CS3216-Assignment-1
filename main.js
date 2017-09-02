const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000
const database = require('./database');

app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.render("./index.html");
});

app.get('/questions', function (req, res) {
	// stub
	// loadJsonFromFile("./resources/mock-data/questions.json", req, res);

	// from database
	try {
		data = JSON.stringify(database.getQuestions('page_id'));
		res.writeHead(200, {
			"Content-Type": "application/json"
		});
		res.end(data);
	} catch (error) {
		console.log("Failed to fetch questions: " + error.message);
		res.writeHead(404);
		res.end();
	}
});

app.post('/user', function (req, res) {
	const body = req.body;
	const user = {
		id: body.user_id,
		name: body.user_name,
		desc: body.user_desc
	}
	const involved = {
		user_id: body.user_id,
		page_ide: body.page_id
	}
	database.addUser(user);
	database.addInvolved(involved);
	for (let i = 1; i <= body.responses.length; i++) {
		const response = {
			user_id: body.user_id,
			page_id: body.page_id,
			question_index: i,
			score: body.responses[i]
		}
		database.addResponse(response);
	}
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