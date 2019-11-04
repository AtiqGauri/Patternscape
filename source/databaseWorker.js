const {database} = require('./database.js');
const fileSystem = require('fs');
const readline = require('readline');
const stream = require('stream');
const workerAcknowledgement = "DONE";
var duplicates, totalRecords;

database.open().catch(function(error){
    console.error("ERROR: "+ error);
});

console.log('Database worker is started');

async function test_database_operation(){
    var result = await database.Patterns.where('pattern').equals('This/Is/Just/For/Test/').toArray()
    totalRecords = totalRecords - duplicates;
    var str = "Duplicates " + duplicates.toString() + " Added " + totalRecords.toString();
    postMessage(str);
}

var instream = fileSystem.createReadStream('data/Stats/Patterns.txt');
var outstream = new stream;
var readInterface = readline.createInterface(instream, outstream);
var splitter;

database.transaction('rw', database.Patterns, () => {
    duplicates = 0;
    totalRecords=0;
    readInterface.on('line', function(line) {
        totalRecords++;
        splitter = line.split('<|>');
        database.Patterns.add({
            pattern: splitter[0],
            address: splitter[1],
            popularity: splitter[2]
        }).catch(function (e) {
            console.log(e.message);
            duplicates++;
        });
    });
}).catch(function (e) {
    console.error("ERROR: "+ e);
});

readInterface.on('close', function() {
    test_database_operation();
});