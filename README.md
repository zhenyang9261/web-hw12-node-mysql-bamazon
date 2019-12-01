# Bamazon Node.js App

## About this app
This is a Node app that simulates online shopping functionalities. There are 3 modules:
* **Customer** - Customers can use this module to view what products are available and buy products.
* **Mamager** - Managers can use this module to view current products, view products with low inventory (less than 5), add inventory to certain product and add new products.
* **Supervisor** - Supervisors can use this module to view department and product information from a high level point of view. They can see the overhead cost, total product sales and total profit of each department. Supervisors can also use this module to add new departments. 

## How to set up the app and run in your local computer
1. Clone this github repository to your local computer.
2. Enter the app folder, and type "npm install". This will install necessary node packages.
3. You will need a local mySql server to run this app. Open up your local mySql Workbench and run the sql scripts provided in this repo. Run schema.sql to create tables, then run seeds.sql to insert seed rows in the tables.
4. In the local folder, create a file .env and put your database user and password in the file in the following format:

    DB_USER=your-user-name

    DB_PWD=your-password

## How to run this app
Run the 3 modules as following: 

**node bamazonCustomer.js**

A list of products will show when this module is loaded. Users can enter the item id and quantity to buy. 

User input validation:
* Item ID can't be empty, and must be an existing item id.
* Buying quantity can't be empty and has to be a positive integer.
* Buying quantity has to be less than the quantity available

**node bamazonManager.js**

Users can choose from 4 options:

* View Products For Sale - view all products.
* View Low Inventory - view products with inventory less than 5.
* Add to Inventory - add inventory to certain item.
* Add Product - add new product. Define product name, quantity and price.

User input validation for Add to Inventory:
* Item ID can't be empty and must be an existing item id.
* Inventory quantity to be added can't be empty and has to be a positive integer.

User input validation for Add Product:
* Product name can't be empty.
* Quantity to be added can't be empty and has to be a positive integer.
* Price can't be empty and has to be a positive number.

**node bamazonSupervisor**

Users can choose from 2 options: 

* View Product Sales by Department - view all departments and their overhead costs, total product sales and total profits.
* Create New Department - create new department. Define name and overhead cost.

User validation for Create New Department
* Department name can't be empty.
* Overhead cost can't be empty and has to be a positive number. 

## Demo
There are 3 short video clips in folder ./videos in this repo that demonstrate how the 3 modules work.


