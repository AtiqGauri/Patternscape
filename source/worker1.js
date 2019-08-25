const testAddon = require('./tool-addon/addon.node');

onmessage = function(e) {
    var i;
	i = testAddon.add(Number(e.data),4);
	//console.log(i);
	postMessage(i);
	module.exports = testAddon;
};
