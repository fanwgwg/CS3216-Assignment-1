module.exports = {
    DBOPTIONS: {
        connectionLimit: 10,
        host: "assignment-1.cbvy9uwdbgm6.ap-southeast-1.rds.amazonaws.com",
        user: process.env.MYSQL_ID,
        password: process.env.MYSQL_PASSWORD,
        database: "Teamker"
    }
}