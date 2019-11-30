//This file is created so that user doesn't have to manually copy updated c++ files, when we make changes in backend code.
//Import cpy package
const cpy = require('cpy');

//copy updated C++ files into native addon src folder
//copy all the header and source files except VS project source file
(async () => {
	await cpy(
		[
		'../PasswordTool-CPP-Backend/*.h',
		'../PasswordTool-CPP-Backend/*.cpp',
		'!../PasswordTool-CPP-Backend/PasswordTool-CPP-Backend.cpp'
		], 
		'../PasswordTool-Native-Addon/src/');
})();