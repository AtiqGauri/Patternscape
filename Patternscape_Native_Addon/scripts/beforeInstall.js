const fs = require('fs');


//DELETE DIST FOLDER OF APP DISTRIBUTABLE BEFORE CREATING NEW ONE
remove_directories(__dirname + '/../build');


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