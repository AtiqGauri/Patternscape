const { stats_generator_api, analyze_data_api } = require("./build/Release/addon.node");
testAddon = require("./build/Release/addon.node");
//console.log(analyze_data_api(4,3));
console.log(stats_generator_api(3));

const moveFile = require('move-file');
 
(async () => {
    await moveFile('build/Release/addon.exp', '../PasswordTool-CPP/Debug/addon.exp');
    console.log('The file has been moved');
})();

module.exports = testAddon;