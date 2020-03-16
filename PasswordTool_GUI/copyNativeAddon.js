//THIS FILE IS CREATED SO THAT USER DOESN'T HAVE TO MANUALLY COPY UPDATED ADDON FILES, WHEN WE MAKE CHANGES IN ADDON CODE
//IMPORT CPY PACKAGE
const cpy = require('cpy');

//COPY COMPILED NATIVE ADDON FILES INTO APP SOURCE FOLDER
(async () => {
	await cpy(
		[
		'../PasswordTool_Native_Addon/build/Release/addon.exp',
		'../PasswordTool_Native_Addon/build/Release/addon.lib',
		'../PasswordTool_Native_Addon/build/Release/addon.node',
		], 
		'source/tool_addon/');
})();