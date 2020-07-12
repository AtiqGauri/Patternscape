//REQUIRE NODE MODULES
const path = require('path');
const fs = require('fs');

//REQUIRE NATIVE C++ ADDON 
const testAddon = require('../tool_addon/addon.node');

//FUNCTION TO COMMUNICATE WITH MAIN THREAD
onmessage = function(e) {
	
	try{
		
		var result;

		//check if app is packaged or not
		if(fs.existsSync(path.join(process.resourcesPath, 'app.asar'))){
			//call c++ analyzation api function with added asar path
	    	result = testAddon.analyze_data_api(Number(e.data), path.join(process.resourcesPath, '..', '/').replace(/\\/g, '/'));
			//console.log(addon.hello(path.join(process.resourcesPath, '..', 'data')));
		}else{
			//call c++ analyzation api function without added asar path
			result = testAddon.analyze_data_api(Number(e.data), "");
		}

		//return acknowledgment/result to main thread
		postMessage(result);
	}catch(err){
		console.error(err);
	}
	
	module.exports = testAddon;
	return;
};
