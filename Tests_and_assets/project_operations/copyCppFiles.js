//THIS FILE IS CREATED SO THAT USER DOESN'T HAVE TO MANUALLY COPY UPDATED C++ FILES, WHEN WE MAKE CHANGES IN BACKEND CODE.
//IMPORT CPY PACKAGE
const cpy = require('../../PasswordTool_GUI/node_modules/cpy');

//COPY UPDATED C++ FILES INTO NATIVE ADDON SRC FOLDER
//COPY ALL THE HEADER AND SOURCE FILES EXCEPT VS PROJECT SOURCE FILE
(async () => {
	await cpy(
		[
		__dirname + '/../../PasswordTool_CPP_Backend/*.h',
		__dirname + '/../../PasswordTool_CPP_Backend/*.cpp',
		'!' + __dirname + '/../../PasswordTool_CPP_Backend/PasswordTool_CPP_Backend.cpp'
		],
		__dirname + '/../../PasswordTool_Native_Addon/src/');
})();

//COPY SAMPLE INPUT FOR THE FIRST TIME USER
(async () => {
	await cpy(
		__dirname + '/../data/sample_input.txt', 
		__dirname + '/../../PasswordTool_Native_Addon/data/Input/'
		);
})();
(async () => {
	await cpy(
		__dirname + '/../data/sample_input.txt', 
		__dirname + '/../../PasswordTool_GUI/data/Input/'
		);
})();
(async () => {
	await cpy(
		__dirname + '/../data/sample_input.txt', 
		__dirname + '/../../PasswordTool_CPP_Backend/data/Input/'
		);
})();