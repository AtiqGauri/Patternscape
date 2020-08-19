/*******************************************************/
//      OPERATIONS BEFORE CREATING DISTRIBUTABLE
/*******************************************************/

//IMPORT CPY PACKAGE
const cpy = require(__dirname + '/../../../Patternscape_GUI/node_modules/cpy');
const fs = require('fs');
const path = require('path');

//COPY SAMPLE INPUT FOR THE FIRST TIME USER
(async () => {
	await cpy(
		[
		__dirname + '/../../data/sample_input.txt',
		__dirname + '/../../original_assets/additional scripts/Launch Patternscape.sh'
		],
		__dirname + '/../../../Patternscape_GUI/data/Input/'
		);
})();


//COPY LAUNCH SHORTCUT SCRIPT FOR LINUX 
if(process.platform === "linux"){
	(async () => {
		await cpy(
			[
			__dirname + '/../../original_assets/additional scripts/Launch Patternscape.sh'
			],
			__dirname + '/../../../Patternscape_GUI/'
			);
	})();
}

//DELETE DIST FOLDER OF APP DISTRIBUTABLE BEFORE CREATING NEW ONE
fs.rmdirSync(path.join(__dirname, '/../../../Patternscape_GUI/releases'), { recursive: true });