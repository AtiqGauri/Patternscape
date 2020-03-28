
//REQUIRE NATIVE C++ ADDON
const testAddon = require('../tool_addon/addon.node');


//CALL C++ ANALYZATION API FUNCTION 
var j = testAddon.stats_generator_api(2);
//console.log(j);

//RETURN ACKNOWLEDGMENT/RESULT TO MAIN THREAD
postMessage(j);

module.exports = testAddon;