require('dotenv').config();
var inquirer = require("inquirer");
var mysql = require("mysql");
var Table = require('cli-table2');
var colors = require('colors');


// connection to SQL database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: process.env.MYSQL_PASSWORD,
  database: "bamazonDB"
});


//shows connection ID
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
  });

 //start function  
  function start() {

    inquirer.prompt([{

        type: "confirm",
        name: "confirm",
        message: "Welcome to Bamazon! Would you like to view our inventory?",
        default: true

    }]).then(function(user) {
        if (user.confirm === true) {
            products();
        } else {
            console.log("Thank you! Come back soon!");
           
        }
    });
}

//function displaying all inventory
 function products() {
    connection.query("SELECT * FROM products", function(err, res) {
      if (err) throw err;

      var table = new Table({
          head: ["ID", "Product Name", "Department Name", "Price", "Stock Quantity"]
        });

        console.log("=======Current Products Available at Bamazon=======");

     
        for (var i = 0; i < res.length; i++) {
            table.push(
                [res[i].id, res[i].product_name, res[i].department_name, parseFloat(res[i].price).toFixed(2), res[i].stock_quantity]
            );
        }


    console.log("-------------------------------------------------");
    
    console.log(table.toString());

//prompt customer's input
     inquirer.prompt([
         {
          type: "number",
          name: "id",
          message: "What is the item ID you would like to buy?",
          validate: function(value) {
              if (isNaN(value) == false) {
                  return true;
              } else {
                  return false;
              }
            }
          }, {
            type: "number",
            name: "quantity",
            message: "How many of this item would you like to buy?",
            validate: function(value) {
                if (isNaN(value) == false) {
                    return true;
                } else {
                    return false;
                }
            }
        },
    ]) //placing order function
    .then(function (cart) {

        var quantity = cart.quantity;
        var itemID = cart.id;

        connection.query('SELECT * FROM products WHERE id=' + itemID, function (err, selectedItem) {
            if (err) throw err;

   
            if (selectedItem[0].stock_quantity - quantity >= 0) {

                console.log("INVENTORY AUDIT: Quantity in Stock: ".green + selectedItem[0].stock_quantity + " Order Quantity: ".green + quantity.yellow);

                console.log("Congratulations! Bamazon has sufficient inventory of ".green + selectedItem[0].product_name.yellow + " to fill your order!".green);

                console.log("Thank you for your purchase. Your order total will be ".green + (cart.quantity * selectedItem[0].price).toFixed(2).yellow + " dollars.".green, "\nThank you for shopping at Bamazon!".magenta);
             
                connection.query('UPDATE products SET stock_quantity=? WHERE id=?', [selectedItem[0].stock_quantity - quantity, itemID],

                    function (err, inventory) {
                        if (err) throw err;

                        products();  
                    }); 

            }
           
            else {
                console.log("INSUFFICIENT INVENTORY ALERT: \nBamazon only has ".red + selectedItem[0].stock_quantity + " " + selectedItem[0].product_name.cyan + " in stock at this moment. \nPlease make another selection or reduce your quantity.".red, "\nThank you for shopping at Bamazon!".magenta);

                products();  
            }
        });
    });
});

} 
     

        
