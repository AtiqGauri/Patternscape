var Dexie = require('dexie');

var database = new Dexie("PasswordTool");

database.version(1).stores({
    Patterns: 'pattern,address,popularity'
})

database.open().catch(function(error){
    console.log("ERROR: "+ error);
});

async function starts_with_ignore_case(str) {
    var arr = [];
    await database.table('Patterns').where('pattern').startsWithIgnoreCase(str)
                     .each(function (p) {
                        arr.push(p.pattern);
                     });
    return arr;
}

async function equals_any_of(str1, str2, str3) {
    var arr =[];
    await database.table('Patterns').where('pattern').anyOf(str1, str2, str3)
                     .each(function (p) {
                        arr.push(p.pattern);
                     });
    return arr;
}

async function equals_ignore_case(str) {
    var arr = [];
    await database.table('Patterns').where('pattern').equalsIgnoreCase(str)
                     .each(function (p) {
                        arr.push(p.pattern);
                     });
    return arr;
}

async function logical_OR(str) {
    var arr = [];
    await database.table('Patterns').where('pattern').startsWithIgnoreCase(str)
                     .or(popularity).below(40)
                     .each(function (p) {
                        arr.push(p.pattern);
                     });
    return arr;
}

async function logical_AND(str) {
    var arr = [];
    await database.table('Patterns').where('pattern').startsWithIgnoreCase(str)
        .and(function (p) { return p.popularity > 40; })
        .each(function (p) {
            arr.push(p.pattern);
        });
    return arr;
}

//
module.exports = {
    database,
    starts_with_ignore_case 
}