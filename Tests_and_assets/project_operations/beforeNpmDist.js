/*******************************************************/
//      OPERATIONS BEFORE CREATING DISTRIBUTABLE
/*******************************************************/

//IMPORT CPY PACKAGE
const cpy = require('../../PasswordTool_GUI/node_modules/cpy');

//COPY SAMPLE INPUT FOR THE FIRST TIME USER
(async () => {
	await cpy(
		__dirname + '/../data/sample_input.txt',
		__dirname + '/../../PasswordTool_GUI/data/Input/'
		);
})();