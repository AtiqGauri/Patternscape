const {database} = require('./database.js');

console.log('Database worker has started');



database.open().catch(function(error){
    console.log("ERROR: "+ error);
});

function say_added(){
    console.log("Data record is added");
}

database.Patterns.put({pattern: "Common/Name/Location", address:"data/Stats/Pattern Data/common.txt", popularity:51}).then(say_added)
database.Patterns.put({pattern: "DOB/Name/Location", address:"data/Stats/Pattern Data/Name.txt",popularity:5}).then(say_added)

function show_data(data){
    console.log(data[0].address);
}

var acknowledgement = "DONE";

async function get_data(){
    var result = await database.Patterns.where('pattern').equals('DOB/Name/Location').toArray()
    show_data(result);
    postMessage(acknowledgement);
}

get_data();