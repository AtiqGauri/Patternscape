const cpy = require('cpy');
(async () => {
	await cpy(
		[
		'../PasswordTool-CPP-Backend/*.h',
		'../PasswordTool-CPP-Backend/*.cpp',
		'!../PasswordTool-CPP-Backend/PasswordTool-CPP-Backend.cpp'
		], 
		'../PasswordTool-Native-Addon/src/');
})();