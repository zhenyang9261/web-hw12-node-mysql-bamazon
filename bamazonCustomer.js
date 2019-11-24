require("dotenv").config();
var mysql = require("mysql");

var divider = "\n---------------------------------------------\n";

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PWD,
  database: "bamazon_db"
});
console.log(process.env.DB_PWD);

connection.connect(function(err) {
  if (err) throw err;
  
  listProducts();
});

function listProducts() {
  
  console.log("Please chooose from the products below" + divider);

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    
    console.log(res);
    connection.end();
  });
}
