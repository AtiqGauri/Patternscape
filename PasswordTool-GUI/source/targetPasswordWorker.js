//require native C++ addon 
const testAddon = require('./tool-addon/addon.node');


onmessage = function(passedData) {

    //passData.data.p is password and passData.data.e is email
    var result = testAddon.target_password_api(String(passedData.data.p), String(passedData.data.e));

    postMessage(result);

    module.exports = testAddon;
};