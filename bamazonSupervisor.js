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
 * Main function of the app starts here. Provide 2 options
 */
function main() {
  
  console.log(divider);

  inquirer
  .prompt({
    type: "list",
    name: "option",
    message: "Please choose from the following options:",
    choices: ["View Product Sales by Department", "Create New Department"]
  })
  .then(function(answer) {

    switch(answer.option) {
        case "View Product Sales by Department":
            salesByDept();
            break;
        case "Create New Department":
            newDept();
            break;
        default: // This shouldn't happen
            break;
    }
  });
}

/**
 * Function to view department summary
 * SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) total_product_sales, sum(p.product_sales)-d.over_head_costs total_profit
 * FROM departments d 
 * LEFT JOIN products p
 * ON d.department_name = p.department_name
 * GROUP BY d.department_id;
 */
function salesByDept() {

    var query = "SELECT d.department_id, d.department_name, d.over_head_costs, sum(p.product_sales) total_product_sales, sum(p.product_sales)-d.over_head_costs total_profit " +
                "FROM departments d " +
                "LEFT JOIN products p " +
                "ON d.department_name = p.department_name " +
                "GROUP BY d.department_id";

    connection.query(query, function(err, res) {
        if (err) throw err;
        
        console.log(divider);

        // Table display requires an array of objects
        var resultTable = [];
        var tableObj;

        for(var i=0; i<res.length; i++) {

            tableObj = {
                department_id: res[i].department_id,
                department_name: res[i].department_name,
                over_head_costs: res[i].over_head_costs,
                total_product_sales: res[i].total_product_sales,
                total_profit: res[i].total_profit
            }
            resultTable.push(tableObj);
        }

        // Display the table
        console.table(resultTable);

        console.log(divider);

        exit();
    });   
}

/**
 * Function to add a new department
 * INSERT INTO departments (department_name, over_head_costs) VALUES <user input values>
 */
function newDept() {

    inquirer
    .prompt([{
      name: "department_name",
      type: "input",
      message: "Name of the department: "
    },
    {
      name: "overhead",
      type: "input",
      message: "Overhead Costs: "
    }])
    .then(function(answer) {

        var department_name = answer.department_name;
        var overhead = answer.overhead;

        // User input validation based on database table constraints and user input 
        // 1. department_name can't be null
        if (!department_name) {
            console.log("\nDepartment Name can't be empty.\n");
            exit();
            return;
        }

        // 2. overhead can't be null and has to be a positive number
        if (!overhead || isNaN(Number(overhead)) || parseFloat(overhead) <= 0) {
            console.log("\nOverhead Costs can't be empty and has to be a positive number.\n");
            exit();
            return;
        }   

        // Convert input to correct format 
        department_name = department_name.trim();
        overhead = parseFloat(overhead).toFixed(2);

        // Insert a new row into the database table
        connection.query("INSERT INTO departments (department_name, over_head_costs) \
                          VALUES ('" + department_name + "', " + overhead + ")", function(err, res) {
            if (err) throw err;

            console.log(divider + "New department (" + department_name + ") added." + divider);
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

