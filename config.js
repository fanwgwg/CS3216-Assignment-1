module.exports = {
    DBOPTIONS: {
        connectionLimit: 10,
        host: "localhost",
        user: "root",
        password: process.env.MYSQL_PASSWORD,
        database: "Teamker"
    }
}