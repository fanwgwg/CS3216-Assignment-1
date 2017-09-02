const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000
const database = require('./database');

app.use(express.static(__dirname));

app.get('/', function (req, res) {
	res.render("./index.html");
});

/** 
 * Register a new user to database
 * 
 * @param /questions?page_id="facebook page id"
 * @return list of questions under the page
 * 			response = { questions: ["coding", "business", "design"] }
 */
app.get('/questions', function (req, res) {
	// stub
	// loadJsonFromFile("./resources/mock-data/questions.json", req, res);

	// from database
	const page_id = req.query.page_id;
	try {
		// data = JSON.stringify(database.getQuestions(page_id));
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

/** 
 * Register a new user to database
 * 
 * request.body = {
 *    	user_id: "user facebook id",
 * 		user_name: "user facebook name",
 *		user_desc: "user desc input",
 *		page_id: "facebook page id",
 *		responses: [q1_score, q2_score, ...]
 * }
 */
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
	try {
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
	} catch (error) {
		console.log(error.message);
		res.writeHead(500);
		res.end();
	}
	res.writeHead(200);
	res.end();
});

/** 
 * User login to web app
 * 
 * @param /frontpage?user_id="user facebook id"
 * @return list of pages the user is involved
 * 			response = { pages: ["CS3216", "CS3217", "CS2103"] }
 */
app.get('/frontpage', function (req, res) {
	const user_id = req.query.user_id;
	let pages;
	try {
		data = JSON.stringify(database.getPagesUserInvolved(user_id));
		res.writeHead(200, {
			"Content-Type": "application/json"
		});
		res.end(data);
	} catch (error) {
		console.log(error.message);
		res.writeHead(500);
		res.end();
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