/*******************************************************/
//      OPERATIONS BEFORE CREATING DISTRIBUTABLE
/*******************************************************/

//IMPORT CPY PACKAGE
const cpy = require(__dirname + '/../../../PasswordTool_GUI/node_modules/cpy');
const fs = require('fs');

//COPY SAMPLE INPUT FOR THE FIRST TIME USER
(async () => {
	await cpy(
		__dirname + '/../../data/sample_input.txt',
		__dirname + '/../../../PasswordTool_GUI/data/Input/'
		);
})();



//DELETE DIST FOLDER OF APP DISTRIBUTABLE BEFORE CREATING NEW ONE
remove_directories(__dirname + '/../../../PasswordTool_GUI/dist');


/**
 * FUNCTION TO DELETE A DIRECTORY INCLUDING ALL FILES CONTAINED IN IT
 * @param {String} dirPath PATH OF DIRECTORY  
 */
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