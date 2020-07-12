//REQUIRE NODE MODULES
const path = require('path');
const fs = require('fs');

//REQUIRE NATIVE C++ ADDON
const testAddon = require('../tool_addon/addon.node');

try{

	var result;

	//CHECK IF APP IS PACKAGED OR NOT
	if(fs.existsSync(path.join(process.resourcesPath, 'app.asar'))){
		//call c++ stats generation api function with added asar path 
		result = testAddon.stats_generator_api(2, path.join(process.resourcesPath, '..', '/').replace(/\\/g, '/'));
		//console.log(addon.hello(path.join(process.resourcesPath, '..', 'data')));
	}else{
		//call c++ stats generation api function without added asar path
		result = testAddon.stats_generator_api(2, "");
	}

		//RETURN ACKNOWLEDGMENT/RESULT TO MAIN THREAD
	postMessage(result);

}catch(err){
   console.error(err);
}

module.exports = testAddon;