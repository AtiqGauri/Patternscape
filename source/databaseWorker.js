var Dexie = require('dexie');

console.log('Database worker has started');

var db = new Dexie("Patterns");

db.version(1).stores({
    Patterns: 'pattern,address'
})

db.open().catch(function(error){
    console.log("ERROR: "+ error);
});

function say_added(){
    console.log("Data record is added");
}

db.Patterns.put({pattern: "Common/Name/Location", address:"data/Stats/Pattern Data/common.txt"}).then(say_added)
db.Patterns.put({pattern: "DOB/Name/Location", address:"data/Stats/Pattern Data/Name.txt"}).then(say_added)

function show_data(data){
    console.log(data[0].address);
}

var acknowledgement = "DONE";

async function get_data(){
    var result = await db.Patterns.where('pattern').equals('DOB/Name/Location').toArray()
    show_data(result);
    postMessage(acknowledgement);
}

get_data();