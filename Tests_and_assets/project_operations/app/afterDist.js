/*******************************************************/
//      OPERATIONS AFTER CREATING DISTRIBUTABLE
/*******************************************************/

//IMPORT CPY PACKAGE
const cpy = require(__dirname + '/../../../Patternscape_GUI/node_modules/cpy');
const fs = require('fs');
const path = require('path');

if(process.platform === "linux"){
    //DELETE LAUNCH PROGRAM SHORTCUT SCRIPT ONCE IT IS PACKAGED WITH APP
    fs.rmdirSync(path.join(__dirname, '/../../../Patternscape_GUI/Launch Patternscape.sh'), { recursive: true });
}