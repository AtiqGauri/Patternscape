const {database} = require('./database.js');
const lineByLine = require('n-readlines');
var duplicates=0, addedRecords=0, splitter;

database.open().catch(function(error){
    console.error("ERROR: "+ error);
});

const liner = new lineByLine('./data/Stats/Patterns.txt');
let line;
let lineNumber = 0;
database.transaction('rw', database.Patterns, async () => {
  while (line = liner.next()) {
    splitter = line.toString().split('<|>');
    await database.Patterns.add({
      pattern: splitter[0],
      address: splitter[1],
      popularity: splitter[2]
    }).then(function(){
      addedRecords++ 
      lineNumber++; 
    }).catch(function (e) {
      console.log(e.message);
      duplicates++;
      lineNumber++;
    });
  }
}).then(function(){
  postMessage("Duplicates " + duplicates.toString() + " Added " + addedRecords.toString());//use when you are using a web worker
}).catch(error => {
  console.error(error);
});