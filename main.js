const fs = require('fs');
const express = require('express');
const app = express();
const port = process.env.port || process.env.PORT || 8000
const database = require('./database');

app.use(express.static(__dirname));
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

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
app.get('/api/questions', function (req, res) {
	// stub
	// loadJsonFromFile("./resources/mock-data/questions.json", req, res);

	try {
		const page_id = req.query.page_id;
		database.getQuestions(page_id, function(questions){
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
app.post('/api/admin', async function (req, res) {
	try {
		const body = req.body;
		const page = {
			id: body.page_id,
			name: body.page_name,
			admin_id: body.admin_id
		}
		await database.addPage(page);
		for (let i = 0; i < body.questions.length; i++) {
			const question = {
				page_id: body.page_id,
				index: i + 1,
				attribute: body.questions[i]
			}
			await database.addQuestion(question);
		}
		for (let i = 0; i < body.user_ids.length; i++) {
			const user = {
				id: body.user_ids[i],
				name: body.user_names[i]
			}
			await database.addUser(user);
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
 * @returns Matched user list
 * 		 	response = { users: [{ id: "user_id", name: "user_name", "desc": "user_desc", "score": "match_score" }, ...]}
 */
app.post('/api/response', async function (req, res) {
	try {
		const body = req.body;
		await database.addDescription(body.user_id, body.user_desc);
		for (let i = 0; i < body.responses.length; i++) {
			const response = {
				user_id: body.user_id,
				page_id: body.page_id,
				question_index: i+1,
				score: body.responses[i]
			}
			await database.addResponse(response);
		}
		database.getMatchedList(body.user_id, body.page_id, function(data){
			const users = {
				"users": data
			}
			res.writeHead(200);
			res.end(users);
		});
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
app.get('/api/frontpage', function (req, res) {
	try {
		const user_id = req.query.user_id;
		database.getPagesUserInvolved(user_id, function (pages) {
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

/**
 * Return true if this group is on Teamker, false otherwise
 * 
 * @param /api/checkNewGroup?page_id="facebook page id"
 * @return response = "true" OR "false" string
 */
app.get('/api/checkNewGroup', function (req, res) {
	try {
		const page_id = req.query.page_id;
		database.checkPageExist(page_id, function (exist) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify(exist));
		});
	} catch (error) {
		console.log(error.message);
		res.writeHead(500);
		res.end(error.message);
	}
});

/**
 * Given the page id, return a list of users that have answered all the questions, given the page id
 * 
 * @param /api/usersOnTeamker?page_id="facebook page id"
 * @return list of registered users
 * 			response = { users: [{id: "user id", name: "user name", desc: "user desc"}, ...] }
 */
app.get('/api/usersOnTeamker', function (req, res) {
	try {
		const page_id = req.query.page_id;
		database.getRegisteredUsersFromPage(page_id, function (users) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify(users));
		});
	} catch (error) {
		console.log(error.message);
		res.writeHead(500);
		res.end(error.message);
	}
});

/**
 * Given the page id, return a list of users that have not answered questions, given the page id
 * 
 * @param /api/usersNotOnTeamker?page_id="facebook page id"
 * @return list of non-registered users
 * 			response = { users: [{id: "user id", name: "user name", desc: "user desc"}, ...] }
 */
app.get('/api/usersNotOnTeamker', function (req, res) {
	try {
		const page_id = req.query.page_id;
		database.getNotRegisteredUsersFromPage(page_id, function (users) {
			res.writeHead(200, {
				"Content-Type": "application/json"
			});
			res.end(JSON.stringify(users));
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