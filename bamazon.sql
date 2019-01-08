DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
id INT(11) NOT NULL AUTO_INCREMENT,
product_name VARCHAR(100)NULL,
department_name VARCHAR(100)NULL,
price DECIMAL(10,2) NOT NULL,
stock_quantity INT NULL,
PRIMARY KEY (id)
);


SELECT * FROM products;

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Otterbox phone case", "Electronics", 19.28, 10),
("Cartman Toolkit", "Household", 24.99, 20),
("Portwest Classic Rain Jacket", "Clothing", 24.99, 15),
("Kindle Oasis E-reader", "Electronics", 279.99, 10),
("Echo Dot", "Electronics", 29.99, 10),
("Outdoor patio table", "Outdoors", 58.50, 10),
("Mini Jewelry Travel Case", "Jewelry", 12.99, 30),
("Cards Against Humanity", "Games", 25.00, 50),
("Becoming by Michelle Obama", "Books", 19.50, 40),
("Gel Pens", "Crafts", 18.99, 15)