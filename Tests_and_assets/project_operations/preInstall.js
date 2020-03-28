//IMPORT CPY PACKAGE TO MOVE, COPY & REPLACE FILES
const cpy = require(__dirname + '/../../PasswordTool_GUI/node_modules/cpy');
const fs = require('fs');
var path = require("path");

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


//DELETE BUILD FOLDER OF NATIVE ADDON BEFORE CREATING NEW ONE
//fs.rmdirSync(__dirname + '/../../PasswordTool_Native_Addon/build', {recursive: true});
remove_directories(__dirname + '/../../PasswordTool_Native_Addon/build');

function remove_directories (dirPath) {
    try { var files = fs.readdirSync(dirPath); }
    catch(e) { return; }
	if (files.length > 0){
		for (var i = 0; i < files.length; i++) {
			var filePath = dirPath + '/' + files[i];
			if (fs.statSync(filePath).isFile())
			fs.unlinkSync(filePath);
			else
			remove_directories(filePath);
		}
	}
    fs.rmdirSync(dirPath);
};