//This file is created so that user doesn't have to manually copy updated addon files, when we make changes in addon code
//Import cpy package
const cpy = require('cpy');

//copy compiled native addon files into app source folder
(async () => {
	await cpy(
		[
		'../PasswordTool-Native-Addon/build/Release/addon.exp',
		'../PasswordTool-Native-Addon/build/Release/addon.lib',
		'../PasswordTool-Native-Addon/build/Release/addon.node',
		], 
		'source/tool-addon/');
})();