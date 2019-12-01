require("dotenv").config();
var mysql = require("mysql");

exports.connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: "bamazon_db"
});

