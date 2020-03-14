
//REQUIRE NATIVE C++ ADDON 
const testAddon = require('../tool-addon/addon.node');

//FUNCTION TO COMMUNICATE WITH MAIN THREAD
onmessage = function(e) {
	
	//call c++ analyzation api function 
    var i = testAddon.analyze_data_api(Number(e.data),4);
	//console.log(i);
	
	//return acknowledgment/result to main thread
	postMessage(i);
	
	module.exports = testAddon;
};
