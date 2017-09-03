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
	loadJsonFromFile("./resources/mock-data/questions.json", req, res);

	// from database
	try {
		const page_id = req.query.page_id;
		// data = JSON.stringify(database.getQuestions(page_id));
		database.getQuestions('page_id', function(questions){
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify(questions));
		});
	} catch (error) {
		console.log("Failed to fetch questions: " + error.message);
		res.writeHead(404);
		res.end();
	}
});

/** 
 * Register facebook group
 * 
 * request.body = {
 *    	page_id: "facebook group id",
 *		page_name: "facebook group name",
 *		admin_id: "facebook group admin id",
 *		questions: [q1_attribute, q2_attribute, ...]
 *		user_ids: [user_id_1, user_id_2, ...]
 *		user_names: [user_name_1, user_name_2, ...]
 * }
 */
app.post('/admin', function (req, res) {
	try {
		const body = req.body;
		const page = {
			id: body.page_id,
			name: body.page_name,
			admin_id: body.admin_id
		}
		database.addPage(page);
		for (let i = 0; i < body.questions.length; i++) {
			const question = {
				page_id: body.page_id,
				index: i+1,
				attribute: body.questions[i]
			}
			database.addQuestion(question);
		}
		for (let i = 0; i < body.user_ids.length; i++) {
			const user = {
				id: body.user_ids[i],
				name: body.user_names[i]
			}
			database.addUser(user);
		}
		res.writeHead(200);
		res.end();
	} catch (error) {
		console.log(error.message);
		res.writeHead(500);
		res.end(error.message);
	}
});

/** 
 * Register user responses to database
 * 
 * request.body = {
 *    	user_id: "user facebook id",
 *		user_desc: "user desc input",
 *		page_id: "facebook page id",
 *		responses: [q1_score, q2_score, ...]
 * }
 */
app.post('/response', function (req, res) {
	try {
		const body = req.body;
		database.addDescription(body.user_id, body.user_desc);
		for (let i = 0; i < body.responses.length; i++) {
			const response = {
				user_id: body.user_id,
				page_id: body.page_id,
				question_index: i+1,
				score: body.responses[i]
			}
			database.addResponse(response);
		}
		res.writeHead(200);
		res.end();
	} catch (error) {
		console.log(error.message);
		res.writeHead(500);
		res.end(error.message);
	}
});

/** 
 * User login to web app
 * 
 * @param /frontpage?user_id="user facebook id"
 * @return list of pages the user is involved
 * 			response = { pages: ["CS3216", "CS3217", "CS2103"] }
 */
app.get('/frontpage', function (req, res) {
	try {
		const user_id = req.query.user_id;
		database.getPagesUserInvolved(user_id, function(pages) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify(pages));
		});
	} catch (error) {
		console.log(error.message);
		res.writeHead(500);
		res.end(error.message);
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