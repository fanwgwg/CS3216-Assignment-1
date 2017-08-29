const mysql = require('mysql');
const config = require('../config.js');
const pool = mysql.createPool(config.DBOPTIONS);
pool.getConnection(function (error, connection) {
	if (error) throw error;
	console.log("Database Connected: %s", connection);
});

module.exports = {

    addPage: function (page) {
        pool.query(`INSERT INTO pages VALUES(
                    ${page.id},
                    ${page.name},
                    ${page.admin_id});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New page added: " + page.name);
            }
        });
    },

    addUser: function (user) {
        pool.query(`INSERT INTO users VALUES(
                    ${user.id},
                    ${user.name},
                    ${user.desc});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New user added: " + user.name);
            }
        });
    },

    addInvolved: function (involved) {
        pool.query(`INSERT INTO involved VALUES(
                    ${involved.user_id},
                    ${involved.page_id});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New involved added: " + involved.user_id);
            }
        });
    },

    addQuestion: function (question) {
        pool.query(`INSERT INTO questions VALUES(
                    ${question.page_id},
                    ${question.index},
                    ${question.attribute});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New question added: " + question.attribute);
            }
        });
    },

    addResponse: function (response) {
        pool.query(`INSERT INTO responses VALUES(
                    ${response.user_id},
                    ${response.page_id},
                    ${response.question_index},
                    ${response.score});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New response added: " + response.user_id);
            }
        });
    },

    getQuestions: function (page_id) {
        pool.query(`SELECT * FROM Teamker.questions
                    WHERE page_id=${page_id}
                    ORDER BY 'index';`, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                let data = {
                    questions: []
                };
                results.forEach(function (row) {
                    data.questions.push({
                        "body": row.attribute
                    });
                });
                return data;
            }
        });
    },

    parseUserData: function (callback) {
        let users = [];
        pool.query(`SELECT users.id, users.name, users.desc, GROUP_CONCAT(responses.score) AS attributes
                  FROM users
                  INNER JOIN responses ON users.id = responses.user_id
                  WHERE responses.page_id = 'page_id'
                  GROUP BY users.id;`, function (error, results, fields) {
            if (error) throw error;
            else {
                results.forEach(function (row) {
                    users.push(Object.assign({}, row, {
                        attributes: row.attributes.split(',').map(Number)
                    }));
                });
                callback(users);
            }
        });
    }

}