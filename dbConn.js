require("dotenv").config();
var mysql = require("mysql");

exports.connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PWD,
  database: "bamazon_db"
});

