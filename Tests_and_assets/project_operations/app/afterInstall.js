//IMPORT CPY PACKAGE TO MOVE, COPY & REPLACE FILES
const cpy = require(__dirname + '/../../../Patternscape_GUI/node_modules/cpy');

//COPY COMPILED NATIVE ADDON FILES INTO APP SOURCE FOLDER
(async () => {
	await cpy(
		[
		__dirname + '/../../../Patternscape_Native_Addon/build/Release/addon.exp',
		__dirname + '/../../../Patternscape_Native_Addon/build/Release/addon.lib',
		__dirname + '/../../../Patternscape_Native_Addon/build/Release/addon.node',
		], 
		__dirname + '/../../../Patternscape_GUI/source/tool_addon/');
})();