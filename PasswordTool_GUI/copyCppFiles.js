//THIS FILE IS CREATED SO THAT USER DOESN'T HAVE TO MANUALLY COPY UPDATED C++ FILES, WHEN WE MAKE CHANGES IN BACKEND CODE.
//IMPORT CPY PACKAGE
const cpy = require('cpy');

//COPY UPDATED C++ FILES INTO NATIVE ADDON SRC FOLDER
//COPY ALL THE HEADER AND SOURCE FILES EXCEPT VS PROJECT SOURCE FILE
(async () => {
	await cpy(
		[
		'../PasswordTool_CPP_Backend/*.h',
		'../PasswordTool_CPP_Backend/*.cpp',
		'!../PasswordTool_CPP_Backend/PasswordTool_CPP_Backend.cpp'
		], 
		'../PasswordTool_Native_Addon/src/');
})();