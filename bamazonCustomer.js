require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");

var divider = "\n---------------------------------------------\n";

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.DB_PWD,
  database: "bamazon_db"
});

// Main app starts here
connection.connect(function(err) {
  if (err) throw err;
  
  displayProducts();
});

/**
 * Display all products 
 */
function displayProducts() {
  
  console.log("Please chooose from the products below" + divider);

  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    
    for(var i=0; i<res.length; i++) {
        console.log(res[i].item_id + ". " + res[i].product_name + "  $" + res[i].price + "  (" + res[i].quantity + ")");
    }
    
    buy();
  });
}

/**
 * Buy until user chooses to exit
 */
function buy() {

    // 1st question, item id to buy
    inquirer
      .prompt({
        name: "item_id",
        type: "input",
        message: "What's the ID of the item you would like to buy?"
      })
      .then(function(answer1) {
        
        // Save the item_id for later use
        var item_id = answer1.item_id;
        
        // Get this item's details from the database table and store in local variables for later use
        connection.query("SELECT * FROM products WHERE item_id=?", item_id, function(err, res) {
            if (err) throw err;
            
            var price = res[0].price;
            var quantity = res[0].quantity;
            
            // 2nd question, how many to buy
            inquirer
              .prompt({
                name: "quantity",
                type: "input",
                message: "How many of this item you would like to buy?"
            })
            .then(function(answer2) {
          
                var buyQuantity = answer2.quantity;
  console.log("Price: " + price + "  Buy Quantity: " + buyQuantity + "  Quantity: " + quantity);

                console.log(divider + "Total Cost of Your Purchase: " + price*buyQuantity + divider);

                // Update the quantity in database table
                connection.query("UPDATE products SET quantity=? WHERE item_id=?", [quantity-buyQuantity, item_id], function(err, res) {
                    if (err) throw err;
            
                    // 3rd question, continue buying or exit
                    inquirer
                      .prompt({
                        type: "confirm",
                        message: "Would you like to buy another item?",
                        name: "buyAnother",
                        default: false
                    })
                    .then(function(answer3) {
                        
                        if (answer3.buyAnother) {
                            displayProducts();
                        } else{
                            connection.end();
                        } 
                    }); // 3rd inquirer ends
            
                }); // UPDATE dabasebase query ends
          
            }); // 2nd inquirer ends
        
        }); // SELECT database query ends

      }); // 1st inquirer ends  
}