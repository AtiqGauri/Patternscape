var Dexie = require('dexie');

var database = new Dexie("PasswordTool");

database.version(1).stores({
    Patterns: 'pattern,address,popularity'
})

database.open().catch(function(error){
    console.log("ERROR: "+ error);
});
//
module.exports = {
    database    
}