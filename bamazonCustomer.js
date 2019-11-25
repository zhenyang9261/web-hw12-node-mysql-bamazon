var inquirer = require("inquirer");
var dbConn = require("./dbConn.js");

var divider = "\n---------------------------------------------\n";
var connection = dbConn.connection;

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
            
            // If the item id is not in the table, show error message
            if (res.length === 0) {
              console.log("\nThe item id you chose does not exist.\n");
              continueOrExit();
              return;
            }

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
          
                var buyQuantity = parseInt(answer2.quantity);

                // If user input is not integer or is negative, show error message
                if (isNaN(buyQuantity) || buyQuantity <=0) {
                  console.log("The number entered is not valid.");
                  continueOrExit();
                  return;
                }

                // If not enough items left in stock, show error message
                if (buyQuantity > quantity) {
                  console.log("\nSorry your purchase cannot be completed. We only have " + quantity + " left in stock.");
                  continueOrExit();
                  return;
                }

                console.log(divider + "Total Cost of Your Purchase: " + (price*buyQuantity).toFixed(2) + divider);

                // Update the quantity in database table
                connection.query("UPDATE products SET quantity=? WHERE item_id=?", [quantity-buyQuantity, item_id], function(err, res) {
                    if (err) throw err;
            
                    continueOrExit();        
            
                }); // UPDATE dabasebase query ends
          
            }); // 2nd inquirer ends
        
        }); // SELECT database query ends

      }); // 1st inquirer ends  
}

/**
 * To continue or exit the app
 */
function continueOrExit() {
  
  inquirer
    .prompt({
      type: "confirm",
      message: "Would you like to buy another item?",
      name: "continue",
      default: false
    })
    .then(function(answer) {

        if (answer.continue) {
            displayProducts();
        } else{
            connection.end();
        } 
    }); 
}