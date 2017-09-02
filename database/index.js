const mysql = require('mysql');
const config = require('../config.js');
const pool = mysql.createPool(config.DBOPTIONS);
pool.getConnection(function (error, connection) {
	if (error) throw error;
	console.log("Database Connected: %s", connection);
});

module.exports = {

    addPage: function (page) {
        pool.query(`INSERT INTO Teamker.pages VALUES(
                    ${pool.escape(page.id)},
                    ${pool.escape(page.name)},
                    ${pool.escape(page.admin_id)});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New page added: " + page.name);
            }
        });
    },

    addUser: function (user) {
        pool.query(`INSERT INTO Teamker.users VALUES(
                    ${pool.escape(user.id)},
                    ${pool.escape(user.name)},
                    ${pool.escape(user.desc)});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New user added: " + user.name);
            }
        });
    },

    addInvolved: function (involved) {
        pool.query(`INSERT INTO Teamker.involved VALUES(
                    ${pool.escape(involved.user_id)},
                    ${pool.escape(involved.page_id)});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New involved added: " + involved.user_id);
            }
        });
    },

    addQuestion: function (question) {
        pool.query(`INSERT INTO Teamker.questions VALUES(
                    ${pool.escape(question.page_id)},
                    ${pool.escape(question.index)},
                    ${pool.escape(question.attribute)});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New question added: " + question.attribute);
            }
        });
    },

    addResponse: function (response) {
        pool.query(`INSERT INTO Teamker.responses VALUES(
                    ${pool.escape(response.user_id)},
                    ${pool.escape(response.page_id)},
                    ${pool.escape(response.question_index)},
                    ${pool.escape(response.score)});`, function (error, results, fields) {
            if (error) throw error;
            else {
                console.log("New response added: " + response.user_id);
            }
        });
    },

    getQuestions: function (page_id) {
        pool.query(`SELECT * FROM Teamker.questions
                    WHERE page_id=${pool.escape(page_id)}
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

    getPagesUserInvolved: function (user_id) {
        pool.query(`SELECT * FROM Teamker.involved
                    INNER JOIN Teamker.pages ON page_id = pages.id
                    WHERE user_id=${pool.escape(user_id)};`, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                let data = {
                    pages: []
                };
                results.forEach(function (row) {
                    data.pages.push(row.name);
                });
                return data;
            }
        });
    },

    parseUserData: function (callback) {
        let users = [];
        pool.query(`SELECT users.id, users.name, users.desc, GROUP_CONCAT(responses.score) AS attributes
                  FROM Teamker.users
                  INNER JOIN Teamker.responses ON users.id = responses.user_id
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