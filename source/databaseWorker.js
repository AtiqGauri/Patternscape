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
    var result = await database.Patterns.where('pattern').equals('Mobile/Name/Undetected/').toArray()
    postMessage(workerAcknowledgement);
}

var instream = fileSystem.createReadStream('data/Stats/Patterns.txt');
var outstream = new stream;
var readInterface = readline.createInterface(instream, outstream);
var patternList = [];
var i=0;var splitter;

readInterface.on('line', function(line) {
    // process line here
    splitter = line.split('<|>');
    patternList[i] = {
        pattern: splitter[0],
        address: splitter[1],
        popularity: splitter[2]
    }
    i++;
});

readInterface.on('close', function() {
    // do something on finish here
    
    database.transaction('rw', database.Patterns, () => {
        for (const obj of patternList) {
            database.Patterns.add(obj)
            i++;
        } 
        test_database_operation();
    }).catch(function (e) {
        console.error("ERROR: "+ e);
    });
});