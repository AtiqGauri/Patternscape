const testAddon = require('./tool-addon/addon.node');
var i;
i = testAddon.add(3,4);
//console.log(i);
postMessage(i);
module.exports = testAddon;