var inquirer = require("inquirer");
var dbConn = require("./dbConn.js");

var divider = "\n---------------------------------------------\n";
var connection = dbConn.connection;

// Dababase onnection starts here
connection.connect(function(err) {
  if (err) throw err;
  
  main();
});

/**
 * Main function of the app starts here. Provide 4 options
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
        
        console.log(divider);
        for(var i=0; i<res.length; i++) {
            console.log(res[i].item_id + ". " + res[i].product_name + "  $" + res[i].price + "  (" + res[i].quantity + ")");
        }
        console.log(divider);

        exit();
    });   
}

/**
 * Function to view products with inventory quantity lower than 5.
 * SELECT * FROM products WHERE quantity < 5
 */
function viewLowInventory() {

    connection.query("SELECT * FROM products WHERE quantity < 5", function(err, res) {
        if (err) throw err;
     
        // No low inventory
        if (res.length === 0) {
            console.log(divider + "No low inventory at this time." + divider);
        }
        else {
            console.log(divider);
            for(var i=0; i<res.length; i++) {
                console.log(res[i].item_id + ". " + res[i].product_name + "  $" + res[i].price + "  (" + res[i].quantity + ")");
            }
            console.log(divider);
        }
        exit();
    });   

}

/**
 * Function to add quantity to a certain item
 * UPDATE products SET quantity=<current quatity + user input quantity> WHERE item_id=<user input item id>
 */
function addInventory() {

    // Inquire item id to and quantity
    inquirer
    .prompt([{
      name: "item_id",
      type: "input",
      message: "What's the ID of the item you would like to add inventory to?"
    },
    {
      name: "quantity",
      type: "input",
      message: "How many of this item you would like to add?"
    }])
    .then(function(answer) {
      
      var item_id = answer.item_id;
      var addQuantity = parseInt(answer.quantity);
      
      connection.query("SELECT * FROM products WHERE item_id=?", item_id, function(err, res) {
          if (err) throw err;
          
          // If the item id is not in the table, callback response array will be empty. Show error message
          if (res.length === 0) {
            console.log("\nThe item id you chose does not exist.\n");
            exit();
            return;
          }
          
          // Get this item's details from the database table and store in local variables.
          var quantity = res[0].quantity;
        
          // If user input is not integer or is negative, show error message
          if (isNaN(addQuantity) || addQuantity <=0) {
            console.log("\nThe number entered is not valid.\n");
            exit();
            return;
          }

          var newQuantity = quantity + addQuantity;

          // Update the quantity in database table
          connection.query("UPDATE products SET quantity=? WHERE item_id=?", [newQuantity, item_id], function(err, res) {
              
            if (err) throw err;

            console.log(divider + "You added inventory " + addQuantity + " to item " + item_id + ". Total inventory now is " + newQuantity + divider);
            exit();        
          }); // UPDATE dabasebase query ends
      }); // SELECT database query ends
    }); // inquirer ends  

}

/**
 * Function to add a new product
 * INSERT INTO products (product_name, department_name, price, quantity) VALUES <user input values>
 */
function addProduct() {

    inquirer
    .prompt([{
      name: "product_name",
      type: "input",
      message: "Name of the product: "
    },
    {
      name: "department_name",
      type: "input",
      message: "Name of the department: "
    },
    {
      name: "quantity",
      type: "input",
      message: "Quantity to add: "
    },
    {
      name: "price",
      type: "input",
      message: "Price of the product: "
    }])
    .then(function(answer) {

        var product_name = answer.product_name;
        var department_name = answer.department_name;
        var quantity = answer.quantity;
        var price = answer.price;

        // User input validation based on database table constraints and user input
        // 1. product_name can't be null
        if (!product_name) {
            console.log("\nProduct Name can't be empty.\n");
            exit();
            return;
        }

        // 2. quantity can't be null and has to be a positive integer
        if (!quantity || isNaN(Number(quantity)) || !Number.isInteger(Number(quantity)) || parseInt(quantity) < 0) {
            console.log("\nQuantity can't be empty and has to be a positive integer.\n");
            exit();
            return;
        }

        // 3. price can't be null and has to be a positive number
        if (!price || isNaN(Number(price)) || parseFloat(price) <= 0) {
            console.log("\nPrice can't be empty and has to be a positive number.\n");
            exit();
            return;
        }   

        // Convert input to correct format 
        var quantityInt = parseInt(quantity);
        var priceFloat = parseFloat(price).toFixed(2);

        // Insert a new row into the database table
        connection.query("INSERT INTO products (product_name, department_name, quantity, price) \
                          VALUES ('" + product_name + "', '" + department_name + "', " + quantityInt + ", " + priceFloat + ")", function(err, res) {
            if (err) throw err;

            console.log(divider + "New product (" + product_name + ") added." + divider);
            exit();
        });
    });

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

