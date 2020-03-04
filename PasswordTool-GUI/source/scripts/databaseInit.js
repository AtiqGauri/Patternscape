//require dexie package to create IndexedDB database for our app
var Dexie = require('dexie');
var {database_error_alerts} = require('./alerts.js');

//initialize database 
var database = new Dexie("PasswordTool");

//initialize database schema
database.version(1).stores({
    Patterns: 'pattern,address,popularity'
})
database.version(2).stores({
    Patterns: 'pattern,address,popularity',
    UserData: 'key, value'
})


//check if database is opened successfully (async process)
database.open().catch(function(error){
    console.log("ERROR: "+ error);
});

addUserPreference();


function addUserPreference() {
    UserPreference = [
                    {key: "firstSplashScreen", value: "true"}, 
                    {key: "showAppIntro", value: "true"}
    ];
    database.UserData.bulkAdd(UserPreference).catch(Dexie.BulkError, function (e) {
        e.name === "BulkError" ? null :  console.log('User Data Error: '+ e.message);
    });
    return;
}

/**
 * Function to lookup/find pattern in database 
 * @param {string} partialPattern partial pattern string entered in GUI for pattern search
 */
async function starts_with_ignore_case(partialPattern) {
    
    //array to store matched patterns
    var matchedPatterns = [];

    //async call to database with ignored cases
    await database.table('Patterns').where('pattern').startsWithIgnoreCase(partialPattern)
                     .each(function (value) {
                        //push matched patterns
                        matchedPatterns.push(value);
                     });
    
    //sort array with popularity in descending order 
    matchedPatterns.sort (function (a,b) { return b.popularity - a.popularity; });
    return matchedPatterns;
}

/**
 * Function to get addresses of patterns stored in database
 * @param {string} patternString
 */
async function get_address_of_pattern_file(patternString) {
    
    //array to store matched patterns
    var matchedPatterns = [];
    
    //async call to database with ignored cases
    await database.table('Patterns').where('pattern').equalsIgnoreCase(patternString)
                     .each(function (value) {
                        //push matched patterns
                        matchedPatterns.push(value.address);
                     });

    return matchedPatterns;
}

/**
 * Function to find patterns start with any of strings in database
 * and returns patterns which are matching with those strings
 * @param {string array} targetDataArray array of string (email, name, etc )
 */
async function equals_any_of(targetDataArray) {
    
    //array to store matched patterns
    var matchedPatterns =[];
    
    //async call to database to find patterns starting with any of given strings
    await database.table('Patterns').where('pattern').startsWithAnyOfIgnoreCase(targetDataArray)
                     .each(function (value) {
                        matchedPatterns.push(value);
                     });
    
    //sort resulting array with popularity in descending order 
    matchedPatterns.sort (function (a,b) { return b.popularity - a.popularity; });
    
    //return 99 most popular patterns
    return matchedPatterns.slice(0, 99);
}

//export members
module.exports = {
    database,
    starts_with_ignore_case,
    get_address_of_pattern_file,
    equals_any_of
}