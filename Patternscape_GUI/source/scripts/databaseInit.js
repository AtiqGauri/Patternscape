//REQUIRE DEXIE PACKAGE TO CREATE INDEXED_DB DATABASE FOR OUR APP
var Dexie = require('dexie');
var {database_error_alerts} = require('./alerts.js');

//INITIALIZE DATABASE 
var database = new Dexie("Patternscape");

//INITIALIZE DATABASE SCHEMA
database.version(1).stores({
    Patterns: 'pattern,address,popularity'
})
database.version(2).stores({
    Patterns: 'pattern,address,popularity',
    UserData: 'key, value'
})


//CHECK IF DATABASE IS OPENED SUCCESSFULLY (ASYNC PROCESS)
database.open().catch(function(error){
    console.log("ERROR: "+ error);
});

/**
 * INITIALIZE USER PREFERENCE VALUES IN DATABASE
 * THESE WILL BE MODIFIED AT RUNTIME
 */
add_user_preference();
function add_user_preference() {
    //create an array to specify user preference variables and declaration values
    UserPreference = [
                    {key: "firstSplashScreen", value: 2000}, 
                    {key: "showAppIntro", value: 2}
    ];

    //add variable to user preference database
    database.UserData.bulkAdd(UserPreference).catch(Dexie.BulkError, function (e) {
        e.name === "BulkError" ? null :  console.log('User Data Error: '+ e.message);
    });
    return;
}

/**
 * FUNCTION TO LOOKUP/FIND PATTERN IN DATABASE 
 * @param {string} partialPattern PARTIAL PATTERN STRING ENTERED IN GUI FOR PATTERN SEARCH
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
 * FUNCTION TO GET ADDRESSES OF PATTERNS STORED IN DATABASE
 * @param {string} patternString PATTERN SELECTED BY USER
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
 * FUNCTION TO FIND PATTERNS START WITH ANY OF STRINGS IN DATABASE
 * AND RETURNS PATTERNS WHICH ARE MATCHING WITH THOSE STRINGS
 * @param {string array} targetDataArray ARRAY OF STRING (EMAIL, NAME, ETC )
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

//EXPORT MEMBERS
module.exports = {
    database,
    starts_with_ignore_case,
    get_address_of_pattern_file,
    equals_any_of
}