USE bamazon_db;

INSERT INTO products (product_name, department_name, price, quantity)
VALUES ("The Guardians", "Books", 14.99, 50),
	("The Dancing Girls", "Books", 9.99, 40),
       ("Jenga", "Toys", 6.99, 30),
       ("Lego", "Toys", 18.99, 80),
       ("Coffee mug", "Household", 4.99, 20),
       ("Cutting board", "Household", 8.99, 60),
       ("Griddle", "Household", 34.99, 20),
       ("Aveeno Body Lotion", "Personal Care", 7.99, 90),
       ("Nexxus Shampoo", "Personal Care", 9.99, 40),
       ("Wireless Mouse", "Electronics", 10.99, 30);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books", 1000.00),
	("Toys", 1200.00),
       ("Household", 800.00),
       ("Personal Care", 900.00),
       ("Electronics", 1200.00),
       ("Sports", 1100.00),
       ("Software", 1300.00);
       
       