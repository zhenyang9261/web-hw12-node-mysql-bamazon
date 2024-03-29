var inquirer = require("inquirer");
var dbConn = require("./dbConn.js");

var divider = "\n---------------------------------------------\n";
var connection = dbConn.connection;

// Connection starts here
connection.connect(function(err) {
  if (err) throw err;
  
  main();
});

/**
 * Main function of the app starts here 
 */
function main() {
  
  console.log(divider);
  console.log("Please chooose from the products below" + divider);

  // Display all products
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

    // Inquire item id to buy and quantity
    inquirer
      .prompt([{
        name: "item_id",
        type: "input",
        message: "What's the ID of the item you would like to buy?"
      },
      {
        name: "quantity",
        type: "input",
        message: "How many of this item you would like to buy?"
      }])
      .then(function(answer) {
        
        var item_id = answer.item_id;
        var buyQuantity = parseInt(answer.quantity);
        
        connection.query("SELECT * FROM products WHERE item_id=?", item_id, function(err, res) {
            if (err) throw err;

            // If the item id is not in the table, callback response array will be empty. Show error message
            if (res.length === 0) {
              console.log("\nThe item id you chose does not exist.\n");
              exit();
              return;
            }

            // Get this item's details from the query result and store in local variables for later use
            var price = res[0].price;
            var quantity = res[0].quantity;
            var product_sales = res[0].product_sales;
          
            // If user input quantity is not integer or is negative, show error message
            if (isNaN(buyQuantity) || buyQuantity <=0) {
              console.log("\nThe quantity number entered is not valid.\n");
              exit();
              return;
            }

            // If not enough items left in stock, show error message
            if (buyQuantity > quantity) {
              console.log("\nSorry your purchase cannot be completed. We only have " + quantity + " left in stock.\n");
              exit();
              return;
            }
            
            console.log(divider + "Total Cost of Your Purchase: " + (price*buyQuantity).toFixed(2) + divider);

            // Update the quantity in database table
            var newValue = [
              {
                quantity: quantity-buyQuantity,
                product_sales: product_sales + price*buyQuantity
              },
              {
                item_id: item_id
              }
            ];
            connection.query("UPDATE products SET ? WHERE ?", newValue, function(err, res) {
                
              if (err) throw err;
                exit();        
            }); // UPDATE dabasebase query ends

        }); // SELECT database query ends
      }); // inquirer ends  
}

/**
 * To continue or exit the app
 */
function exit() {
  
  inquirer
    .prompt({
      type: "confirm",
      message: "Would you like to exit?",
      name: "exit",
      default: true
    })
    .then(function(answer) {

        if (!answer.exit) {
            main();
        } else{
            connection.end();
        } 
    }); 
}