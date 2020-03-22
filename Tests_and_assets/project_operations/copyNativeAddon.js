//THIS FILE IS CREATED SO THAT USER DOESN'T HAVE TO MANUALLY COPY UPDATED ADDON FILES, WHEN WE MAKE CHANGES IN ADDON CODE
//IMPORT CPY PACKAGE
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