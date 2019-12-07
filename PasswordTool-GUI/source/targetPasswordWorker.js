//require native C++ addon 
const testAddon = require('./tool-addon/addon.node');

//this will catch arguments(password and email(optional)) sent by
onmessage = function(passedData) {

    //call c++ backend function to process password and email
    //passData.data.p is password and passData.data.e is email
    var result = testAddon.target_password_api(String(passedData.data.p), String(passedData.data.e));

    //pass resulting patterns to main thread
    postMessage(result);

    module.exports = testAddon;
};