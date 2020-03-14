//THIS FILE IS CREATED SO THAT USER DOESN'T HAVE TO MANUALLY COPY UPDATED C++ FILES, WHEN WE MAKE CHANGES IN BACKEND CODE.
//IMPORT CPY PACKAGE
const cpy = require('cpy');

//COPY UPDATED C++ FILES INTO NATIVE ADDON SRC FOLDER
//COPY ALL THE HEADER AND SOURCE FILES EXCEPT VS PROJECT SOURCE FILE
(async () => {
	await cpy(
		[
		'../PasswordTool-CPP-Backend/*.h',
		'../PasswordTool-CPP-Backend/*.cpp',
		'!../PasswordTool-CPP-Backend/PasswordTool-CPP-Backend.cpp'
		], 
		'../PasswordTool-Native-Addon/src/');
})();