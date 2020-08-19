//IMPORT CPY PACKAGE TO MOVE, COPY & REPLACE FILES
const cpy = require(__dirname + '/../../../Patternscape_GUI/node_modules/cpy');
const fs = require('fs');
var path = require("path");

//COPY UPDATED C++ FILES INTO NATIVE ADDON SRC FOLDER
//COPY ALL THE HEADER AND SOURCE FILES EXCEPT VS PROJECT SOURCE FILE
(async () => {
	await cpy(
		[
		__dirname + '/../../../Patternscape_CPP_Backend/*.h',
		__dirname + '/../../../Patternscape_CPP_Backend/*.cpp',
		'!' + __dirname + '/../../../Patternscape_CPP_Backend/Patternscape_CPP_Backend.cpp'
		],
		__dirname + '/../../../Patternscape_Native_Addon/src/');
})();

//COPY SAMPLE INPUT FOR THE FIRST TIME USER
(async () => {
	await cpy(
		__dirname + '/../../data/sample_input.txt', 
		__dirname + '/../../../Patternscape_Native_Addon/data/Input/'
		);
})();
(async () => {
	await cpy(
		__dirname + '/../../data/sample_input.txt', 
		__dirname + '/../../../Patternscape_GUI/data/Input/'
		);
})();
(async () => {
	await cpy(
		__dirname + '/../../data/sample_input.txt', 
		__dirname + '/../../../Patternscape_CPP_Backend/data/Input/'
		);
})();

