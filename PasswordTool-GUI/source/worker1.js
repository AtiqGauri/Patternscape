const testAddon = require('./tool-addon/addon.node');

onmessage = function(e) {
    var i;
	i = testAddon.analyze_data_api(Number(e.data),4);
	//console.log(i);
	postMessage(i);
	module.exports = testAddon;
};
