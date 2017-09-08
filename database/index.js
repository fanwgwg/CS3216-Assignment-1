const mysql = require('mysql');
const logic = require('../logic');
const config = require('../config.js');
const pool = mysql.createPool(config.DBOPTIONS);
pool.getConnection(function (error, connection) {
	if (error) throw error;
	console.log("Database Connected");
});

module.exports = {

    addPage: function (page) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT IGNORE INTO Teamker.pages VALUES(
                        ${pool.escape(page.id)},
                        ${pool.escape(page.name)},
                        ${pool.escape(page.admin_id)});`, function (error, results, fields) {
                if (error) reject(error);
                else {
                    console.log("New page added: " + page.name);
                    resolve();
                }
            });
        });
    },

    addUser: function (user) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT IGNORE INTO Teamker.users VALUES(
                        ${pool.escape(user.id)},
                        ${pool.escape(user.name)});`, function (error, results, fields) {
                if (error) reject(error);
                else {
                    console.log("New user added: " + user.name);
                    resolve();
                }
            });
        });
    },

    addInvolved: function (involved) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT IGNORE INTO Teamker.involved VALUES(
                        ${pool.escape(involved.user_id)},
                        ${pool.escape(involved.page_id)},
                        ${pool.escape(involved.user_desc)});`, function (error, results, fields) {
                if (error) reject(error);
                else {
                    console.log("New involved added: " + involved.user_id);
                    resolve();
                }
            });
        });
    },

    addDescription: function (user_id, user_desc) {
        return new Promise((resolve, reject) => {
            pool.query(`UPDATE Teamker.involved
                        SET user_desc=${pool.escape(user_desc)}
                        WHERE user_id=${pool.escape(user_id)};`, function (error, results, fields) {
                if (error) reject(error);
                else {
                    console.log("Description added: " + user_id);
                    resolve();
                }
            });
        });
    },

    addQuestion: function (question) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT IGNORE INTO Teamker.questions VALUES(
                        ${pool.escape(question.page_id)},
                        ${pool.escape(question.index)},
                        ${pool.escape(question.attribute)});`, function (error, results, fields) {
                if (error) reject(error);
                else {
                    console.log("New question added: " + question.attribute);
                    resolve();
                }
            });
        });
    },

    addResponse: function (response) {
        return new Promise((resolve, reject) => {
            pool.query(`INSERT IGNORE INTO Teamker.responses VALUES(
                        ${pool.escape(response.user_id)},
                        ${pool.escape(response.page_id)},
                        ${pool.escape(response.question_index)},
                        ${pool.escape(response.score)});`, function (error, results, fields) {
                if (error) reject(error);
                else {
                    console.log("New response added: " + response.user_id);
                    resolve();
                }
            });
        });
    },

    getAdminId: function (page_id) {
        return new Promise((resolve, reject) => {
            pool.query(`SELECT admin_id FROM Teamker.pages
            WHERE id=${pool.escape(page_id)};`, function (error, results, fields) {
                if (error) reject(error);
                else {
                    const data = results[0].admin_id;
                    resolve(data);
                }
            });
        });
    },

    getQuestions: function (page_id, callback) {
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
                callback(data);
            }
        });
    },

    checkPageExist: function (page_id, callback) {
        pool.query(`SELECT EXISTS (
                    SELECT * FROM Teamker.pages
                    WHERE id=${pool.escape(page_id)}) AS exist;`, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                const exist = (results[0].exist === 1) ? true : false;
                callback(exist);
            }
        });
    },

    getAllUsersFromPage: function (page_id, callback) {
        pool.query(`SELECT * FROM Teamker.involved
                    INNER JOIN Teamker.users ON user_id=id
                    WHERE page_id=${pool.escape(page_id)};`, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                let data = {
                    users: []
                };
                results.forEach(function (row) {
                    data.users.push({
                        "id": row.id,
                        "name": row.name,
                        "desc": row.user_desc
                    });
                });
                callback(data);
            }
        });
    },

    getRegisteredUsersFromPage: function (page_id, callback) {
        pool.query(`SELECT DISTINCT users.id, users.name, involved.user_desc FROM Teamker.users AS users
                    INNER JOIN Teamker.involved AS involved ON users.id=involved.user_id
                    INNER JOIN Teamker.responses AS responses ON users.id=responses.user_id
                    INNER JOIN Teamker.questions AS questions ON involved.page_id=questions.page_id
                    WHERE involved.page_id=${pool.escape(page_id)};`, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                let data = {
                    users: []
                };
                results.forEach(function (row) {
                    data.users.push({
                        "id": row.id,
                        "name": row.name,
                        "desc": row.user_desc
                    });
                });
                callback(data);
            }
        });
    },

    getNotRegisteredUsersFromPage: function (page_id, callback) {
        pool.query(`SELECT DISTINCT users.id, users.name, involved.user_desc, questions.page_id FROM Teamker.users AS users
                    INNER JOIN Teamker.involved AS involved ON users.id=involved.user_id
                    LEFT JOIN Teamker.responses AS responses ON users.id=responses.user_id
                    LEFT JOIN Teamker.questions AS questions ON responses.page_id=questions.page_id
                    WHERE involved.page_id=${pool.escape(page_id)}
                    AND questions.page_id is NULL;`, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                let data = {
                    users: []
                };
                results.forEach(function (row) {
                    data.users.push({
                        "id": row.id,
                        "name": row.name,
                        "desc": row.user_desc
                    });
                });
                callback(data);
            }
        });
    },
    

    getPagesUserInvolved: function (user_id, callback) {
        pool.query(`SELECT * FROM Teamker.involved
                    INNER JOIN Teamker.pages ON page_id=id
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
                callback(data);
            }
        });
    },

    getMatchedList: function (user_id, page_id, callback) {
        pool.query(`SELECT users.id, users.name, involved.user_desc, GROUP_CONCAT(responses.score) AS attributes
                    FROM Teamker.users
                    INNER JOIN Teamker.responses ON users.id=responses.user_id
                    INNER JOIN Teamker.involved ON users.id=involved.user_id
                    WHERE responses.page_id=${pool.escape(page_id)}
                    GROUP BY users.id, involved.user_desc;`, function (error, results, fields) {
            if (error) {
                throw error;
            } else {
                let users = [];
                results.forEach(function (row) {
                    users.push(Object.assign({}, row,
                        {
                            attributes: row.attributes.split(',').map(Number)
                        }
                    ));
                });
                callback(logic.MostDifferent(user_id, users));
            }
        });
    },

    deletePage: function (page_id) {
        return new Promise((resolve, reject) => {
            pool.query(`DELETE from Teamker.pages
                        WHERE id=${pool.escape(page_id)};`, function (error, results, fields) {
                if (error) {
                    reject(error);
                } else {
                    console.log("Page deleted: " + page_id);
                    resolve();
                }
            });
        });
    }
}
