console.log("asd");
const testAddon = require('./tool-addon/addon.node');
var j; 
j = testAddon.hello();
//console.log(j);
postMessage(j);
module.exports = testAddon;