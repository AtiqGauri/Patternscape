
//require native c++ addon
const testAddon = require('./tool-addon/addon.node');

//call c++ analyzation api function 
var j = testAddon.stats_generator_api(2);
//console.log(j);

//return acknowledgment/result to main thread
postMessage(j);

module.exports = testAddon;