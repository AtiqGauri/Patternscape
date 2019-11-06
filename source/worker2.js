console.log("asd");
const testAddon = require('./tool-addon/addon.node');
var j; 
j = testAddon.stats_generator_api(2);
//console.log(j);
postMessage(j);
module.exports = testAddon;