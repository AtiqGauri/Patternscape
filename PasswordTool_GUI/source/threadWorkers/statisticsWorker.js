
//REQUIRE NATIVE C++ ADDON
const testAddon = require('../tool_addon/addon.node');

//file system to delete and access files
const fs = require('fs');
const path = require('path');



//CALL C++ ANALYZATION API FUNCTION 
var j = testAddon.stats_generator_api(2);
//console.log(j);

//delete analyzed data as stats are generated from it
//double if statements to avoid asar packaging alteration
if(fs.existsSync(path.join(process.resourcesPath, '..', '..','data','Output'))){
    delete_analyzation_output(path.join(process.resourcesPath, '..', '..','data','Output'));
}else if(fs.existsSync(path.join(__dirname, '..', '..', 'data', 'Output'))){
    delete_analyzation_output(path.join(__dirname, '..', '..', 'data', 'Output'));
}else{
    console.error('data/Output/ folder doesn\'t exist');
}

//RETURN ACKNOWLEDGMENT/RESULT TO MAIN THREAD
postMessage(j);

/**
 * FUNCTION TO DELETE FILES FROM DIRECTORY 
 * EXCEPTION FILE IS "Error Log" IT WILL BE EXCLUDED
 * @param {string} directoryPath PATH TO FILES DIRECTORY
 */
function delete_analyzation_output(directoryPath){
    try{
        var files = fs.readdirSync(directoryPath);
        for (const file of files) {
            if(file!='Error Log'){
                fs.unlinkSync(path.join(directoryPath, file), err => {
                    if (err) throw err;
                });
            }
        }
    }catch(error){
        console.error(error);
    }
}


module.exports = testAddon;