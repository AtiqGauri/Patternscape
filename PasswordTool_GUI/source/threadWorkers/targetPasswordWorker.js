//REQUIRE NATIVE C++ ADDON 
const testAddon = require('../tool_addon/addon.node');

//THIS WILL CATCH ARGUMENTS(PASSWORD AND EMAIL(OPTIONAL)) SENT BY
onmessage = function(passedData) {

    //call c++ backend function to process password and email
    //passData.data.p is password and passData.data.e is email
    var result = testAddon.target_password_api(String(passedData.data.p), String(passedData.data.e));

    //pass resulting patterns to main thread
    postMessage(result);

    module.exports = testAddon;

    return;
};