/*******************************************************/
//      OPERATIONS BEFORE CREATING DISTRIBUTABLE
/*******************************************************/

//IMPORT CPY PACKAGE
const cpy = require(__dirname + '/../../../PasswordTool_GUI/node_modules/cpy');
const fs = require('fs');
const path = require('path');

//COPY SAMPLE INPUT FOR THE FIRST TIME USER
(async () => {
	await cpy(
		__dirname + '/../../data/sample_input.txt',
		__dirname + '/../../../PasswordTool_GUI/data/Input/'
		);
})();

//DELETE DIST FOLDER OF APP DISTRIBUTABLE BEFORE CREATING NEW ONE
fs.rmdirSync(path.join(__dirname, '/../../../PasswordTool_GUI/releases'), { recursive: true });