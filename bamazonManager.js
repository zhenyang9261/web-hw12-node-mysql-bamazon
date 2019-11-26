var inquirer = require("inquirer");
var dbConn = require("./dbConn.js");

var divider = "\n---------------------------------------------\n";
var connection = dbConn.connection;

// Main app starts here
connection.connect(function(err) {
  if (err) throw err;
  
  main();
});

/**
 * Main point of the app. Provide 4 options
 */
function main() {
  
  console.log(divider);

  inquirer
  .prompt({
    type: "list",
    name: "option",
    message: "Please choose from the following options:",
    choices: ["View Products For Sale", "View Low Inventory", "Add to Inventory", "Add Product"]
  })
  .then(function(answer) {
  
    switch(answer.option) {
        case "View Products For Sale":
            viewProducts();
            break;
        case "View Low Inventory":
            viewLowInventory();
            break;
        case "Add to Inventory": 
            addInventory();
            break;
        case "Add Product":
            addProduct();
            break;
        default: // This shouldn't happen
            break;
    }
  });
}

/**
 * Function to view all products 
 * SELECT * FROM products
 */
function viewProducts() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        
        for(var i=0; i<res.length; i++) {
            console.log(res[i].item_id + ". " + res[i].product_name + "  $" + res[i].price + "  (" + res[i].quantity + ")");
        }

        continueOrExit();
    });   
}

/**
 * Function to view products with inventory quantity lower than 5.
 * SELECT * FROM products WHERE quantity < 5
 */
function viewLowInventory() {


}

/**
 * Function to add quantity to a certain item
 * UPDATE products SET quantity=<new quatity> WHERE item_id=<user input item id>
 */
function viewLowInventory() {


}

/**
 * Function to add a new product
 * INSERT INTO products (product_name, department_name, price, quantity) VALUESSET <user input values>
 */
function addProduct() {


}

/**
 * To continue or exit the app
 */
function continueOrExit() {
  
  inquirer
    .prompt({
      type: "confirm",
      message: "Would you like to choose another option?",
      name: "continue",
      default: false
    })
    .then(function(answer) {

        if (answer.continue) {
            main();
        } else{
            connection.end();
        } 
    }); 
}

