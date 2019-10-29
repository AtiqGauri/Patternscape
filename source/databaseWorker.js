const {database} = require('./database.js');
const fileSystem = require('fs');
const readline = require('readline');
const stream = require('stream');
const workerAcknowledgement = "DONE";

database.open().catch(function(error){
    console.error("ERROR: "+ error);
});

console.log('Database worker is started');

async function test_database_operation(){
    var result = await database.Patterns.where('pattern').equals('This/Is/Just/For/Test/').toArray()
    postMessage(workerAcknowledgement);
}

var instream = fileSystem.createReadStream('data/Stats/Patterns.txt');
var outstream = new stream;
var readInterface = readline.createInterface(instream, outstream);
var splitter;

database.transaction('rw', database.Patterns, () => {
    readInterface.on('line', function(line) {
        splitter = line.split('<|>');
        database.Patterns.add({
            pattern: splitter[0],
            address: splitter[1],
            popularity: splitter[2]
        }).catch(function (e) {
            console.log(e.message);
        });
    });
}).catch(function (e) {
    console.error("ERROR: "+ e);
});

readInterface.on('close', function() {
    test_database_operation();
});