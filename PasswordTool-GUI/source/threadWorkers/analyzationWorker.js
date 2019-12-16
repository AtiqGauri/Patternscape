
//require native C++ addon 
const testAddon = require('../tool-addon/addon.node');

//function to communicate with main thread
onmessage = function(e) {
	
	//call c++ analyzation api function 
    var i = testAddon.analyze_data_api(Number(e.data),4);
	//console.log(i);
	
	//return acknowledgment/result to main thread
	postMessage(i);
	
	module.exports = testAddon;
};
