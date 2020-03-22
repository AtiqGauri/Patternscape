
//Import navtive addon
const { stats_generator_api, analyze_data_api, target_password_api } = require("./build/Release/addon.node");

//call api functions to test addon
//console.log(analyze_data_api(4,3));
//console.log(stats_generator_api(3));
console.log(target_password_api("idontknow",""));