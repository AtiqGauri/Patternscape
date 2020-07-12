//REQUIRE NODE MODULES
const path = require('path');
const fs = require('fs');

//REQUIRE NATIVE C++ ADDON 
const testAddon = require('../tool_addon/addon.node');

//THIS WILL CATCH ARGUMENTS(PASSWORD AND EMAIL(OPTIONAL)) SENT BY
onmessage = function(passedData) {

    try{
        var result;

        //check if app is packaged or not
        if(fs.existsSync(path.join(process.resourcesPath, 'app.asar'))){
            //call c++ backend function to process password and email
            //passData.data.p is password and passData.data.e is email
            result = testAddon.target_password_api(String(passedData.data.p), String(passedData.data.e),
             path.join(process.resourcesPath, '..', '/').replace(/\\/g, '/'));
            //console.log(addon.hello(path.join(process.resourcesPath, '..', 'data')));
        }else{
            //call c++ backend function to process password and email
            //passData.data.p is password and passData.data.e is email
            result = testAddon.target_password_api(String(passedData.data.p), String(passedData.data.e),
             "");
        }
   		//pass resulting patterns to main thread
        postMessage(result);
    
    }catch(err){
        console.error(err);
    }

    module.exports = testAddon;

    return;
};