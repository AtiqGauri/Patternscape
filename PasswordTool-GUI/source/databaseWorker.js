//require database script
const {database} = require('./database.js');

//require n-readlines to read huge file line by line without excessive use of memory 
const lineByLine = require('n-readlines');

//initialize variables
//duplicates represents how many duplicate records are trying to be added
//addRecords represents how many records have been added
//splitter will be used to split string in tokens
var duplicates=0, addedRecords=0, splitter;

//check if database is opened successfully (async process)
database.open().catch(function(error){
    console.error("ERROR: "+ error);
});

//initialize n-readlines with data file address
const liner = new lineByLine('./data/Stats/Patterns.txt');
//variable to denote single line string
let line;
//variable to count line number(not necessary)
let lineNumber = 0;

//database transaction, this will rollback half completed operation automatically
database.transaction('rw', database.Patterns, async () => {

  //iterate over file
  while (line = liner.next()) {
    
    //split line as per delimiter
    splitter = line.toString().split('<|>');
    
    //add records to database table
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
  //pass successful and unsuccessful records number to main thread.
  postMessage("Duplicates " + duplicates.toString() + " Added " + addedRecords.toString());//use when you are using a web worker
}).catch(error => {
  console.error(error);
});