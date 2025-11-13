const mysql = require('mysql');
const db = mysql;
require('dotenv').config()

const database = db.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

module.exports = database;