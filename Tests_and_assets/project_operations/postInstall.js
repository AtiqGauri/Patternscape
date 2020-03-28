//IMPORT CPY PACKAGE TO MOVE, COPY & REPLACE FILES
const cpy = require('../../PasswordTool_GUI/node_modules/cpy');

//COPY COMPILED NATIVE ADDON FILES INTO APP SOURCE FOLDER
(async () => {
	await cpy(
		[
		__dirname + '/../../PasswordTool_Native_Addon/build/Release/addon.exp',
		__dirname + '/../../PasswordTool_Native_Addon/build/Release/addon.lib',
		__dirname + '/../../PasswordTool_Native_Addon/build/Release/addon.node',
		], 
		__dirname + '/../../PasswordTool_GUI/source/tool_addon/');
})();