const cpy = require('cpy');
(async () => {
	await cpy(
		[
		'../PasswordTool-Native-Addon/build/Release/addon.exp',
		'../PasswordTool-Native-Addon/build/Release/addon.lib',
		'../PasswordTool-Native-Addon/build/Release/addon.node',
		], 
		'source/tool-addon/');
	//console.log(__dirname);
})();