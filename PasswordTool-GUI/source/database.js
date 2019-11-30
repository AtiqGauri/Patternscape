//require dexie package to create IndexedDB database for our app
var Dexie = require('dexie');

//initialize database 
var database = new Dexie("PasswordTool");

//initialize database schema
database.version(1).stores({
    Patterns: 'pattern,address,popularity'
})

//check if database is opened successfully (async process)
database.open().catch(function(error){
    console.log("ERROR: "+ error);
});

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
    /**var arr = [];
    var temp  = [];
    await database.table('Patterns').where('pattern').startsWithIgnoreCase(str)
                     .each(function (p) {
                        arr.push(p);
                     });
    arr.sort (function (a,b) { return b.popularity - a.popularity; });
    for (let index = 0; index < arr.length; index++) {
        temp.push(arr[index].pattern);
    }
    return temp; */
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
 * Function to find given patterns (up to 3) in database  
 * @param {string} pattern1 
 * @param {string} pattern2 
 * @param {string} pattern3 
 */
async function equals_any_of(pattern1, pattern2, pattern3) {
    
    //array to store matched patterns
    var matchedPatterns =[];
    
    //async call to database to find anyone given pattern in database
    await database.table('Patterns').where('pattern').anyOf(pattern1, pattern2, pattern3)
                     .each(function (value) {
                        matchedPatterns.push(value.pattern);
                     });

    return matchedPatterns;
}

//export members
module.exports = {
    database,
    starts_with_ignore_case,
    get_address_of_pattern_file,
    equals_any_of
}