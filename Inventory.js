//Creating the REPL server in node.js
const Repl = require("repl");
var util = require('util');
const prompt = `$ ->`

console.log(
  "please type input in the form of: function(arg1,arg2) and use del instead of delete as delete is a reserved word"
);

//inventory is a list that will be used to keep track of all the items
var inventory = [];
var costPrice;
//profit will keep track of the money spent between reports
var profit = 0;
//the constructor for the Item objects
function Item(itemName, costPrice,sellingPrice) {
  this.itemName = itemName;
  this.costPrice = costPrice;
  this.sellingPrice = sellingPrice;
  this.quantity = 0;
  this.value = 0.0;
}
// the function for creating new objects and placing them in the inventory
global.create = function(itemName, costPrice, sellingPrice) {
  var item = new Item(itemName, costPrice, sellingPrice);
  inventory.push(item);
  inventory.sort((a,b) => ((a.itemName > b.itemName) ? 1 : -1));
}
// the function for deleting an object from the inventory. Delete is reserved so i had to change the name
global.del = function(itemName) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemName.localeCompare(itemName) == 0) {
      profit -= inventory[i].quantity * inventory[i].costPrice;
      inventory.splice(i, 1);
    }
  }
}
// the function for buying new items and updating the quantity in the inventory
global.updateBuy = function(itemName, quantity) {
  for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemName.localeCompare(itemName) == 0) {
      inventory[i].quantity += quantity;
      inventory[i].value = inventory[i].quantity * inventory[i].costPrice;
    }
  }
  
}
//the function that sells items and removes quantity from inventory
global.updateSell = function(itemName, quantity) {
    for (var i = 0; i < inventory.length; i++) {
    if (inventory[i].itemName.localeCompare(itemName) == 0) {
      inventory[i].quantity -= quantity;
      inventory[i].value = inventory[i].quantity * inventory[i].costPrice;
      profit += quantity * (inventory[i].sellingPrice-inventory[i].costPrice);
    }
    
  }
}
//the function that formats the inventory into a more readable table
global.report = function() {
  console.log(util.format("\t \t \t INVENTORY REPORT\n"));
  console.log(util.format("Item Name\tBought At\tSold At\t\tAvailable Quantity\tValue"));
  console.log(util.format("---------\t---------\t-------\t\t------------------\t-----"));
  var totalValue = 0;
  for (var i = 0; i < inventory.length;i++) {
    var item = inventory[i]; 
    console.log(util.format("%s\t\t%s\t\t%s\t\t\t%d\t\t%s", item.itemName, item.costPrice.toFixed(2), item.sellingPrice.toFixed(2), item.quantity, item.value.toFixed(2)));
    totalValue += item.value
  }
  console.log(util.format("-------------------------------------------------------------------------------"));
  console.log(util.format("Total Value\t\t\t\t\t\t\t\t",totalValue.toFixed(2)));
  console.log(util.format("Profit since previous report\t\t\t\t\t\t%s", profit.toFixed(2)));
  profit = 0;
}
//a function i created with the sample inputs given to make testing easier
global.sampleInput = function() {
  create("Book01", 10.50, 13.79);
  create("Food01", 1.47, 3.98);
  create("Med01", 30.63, 34.29);
  create("Tab01", 57.00, 84.98);
  updateBuy("Tab01", 100);
  updateSell("Tab01", 2);
  updateBuy("Food01", 500);
  updateBuy("Book01", 100);
  updateBuy("Med01", 100);
  updateSell("Food01", 1);
  updateSell("Food01", 1);
  updateSell("Tab01", 2);
  report();
  del("Book01");
  updateSell("Tab01", 5);
  create("Mobile01", 10.51, 44.56);
  updateBuy("Mobile01", 250);
  updateSell("Food01", 5);
  updateSell("Mobile01", 4);
  updateSell("Med01", 10);
  report();
}
//starting the repl server to be able to continuously input commands
Repl.start({prompt});

