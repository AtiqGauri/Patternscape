//REQUIRE DATABASE SCRIPT
const {database} = require('../scripts/databaseInit.js');
var path = require('path');

//REQUIRE N-READLINES TO READ HUGE FILE LINE BY LINE WITHOUT EXCESSIVE USE OF MEMORY 
const lineByLine = require('n-readlines');

//INITIALIZE VARIABLES
//"duplicates" REPRESENTS HOW MANY DUPLICATE RECORDS ARE TRYING TO BE ADDED
//"addedRecords" REPRESENTS HOW MANY RECORDS HAVE BEEN ADDED
//"splitter" WILL BE USED TO SPLIT STRING IN TOKENS
var duplicates=0, addedRecords=0, splitter;

//CHECK IF DATABASE IS OPENED SUCCESSFULLY (ASYNC PROCESS)
database.open().catch(function(error){
    console.error("ERROR: "+ error);
});

//INITIALIZE N-READLINES WITH DATA FILE ADDRESS
//CAN THROW ERROR BECAUSE OF ASAR PACKAGING
const liner = new lineByLine(path.join('data', 'Stats', 'Patterns.txt'));
//VARIABLE TO DENOTE SINGLE LINE STRING
let line;
//VARIABLE TO COUNT LINE NUMBER(NOT NECESSARY)
let lineNumber = 0;

//DATABASE TRANSACTION, THIS WILL ROLLBACK HALF COMPLETED OPERATION AUTOMATICALLY
database.transaction('rw', database.Patterns, async () => {

  //iterate over file
  while (line = liner.next()) {
    
    //split line as per delimiter
    splitter = line.toString().split('<|>');
    
    //to check file strings are in correct format => "pattern<|>address<|>popularity"
    if(splitter.length != 3){
      continue;
    }
    
    //add records to database table
    await database.Patterns.add({
      pattern: splitter[0],
      address: splitter[1],
      popularity: splitter[2]
    }).then(function(){
      addedRecords++;
      lineNumber++; 
    }).catch(async function (e) {
      //if record already exist in database then
      if((e.name == "ConstraintError") && (e.message == 'Key already exists in the object store.')){
        //check if popularity is greater than what we have in database
        await database.Patterns.where('pattern')
          .equalsIgnoreCase(splitter[0])
          .and(function(record) { return record.popularity < splitter[2];})
          .toArray (function (isSmall) {
            //if yes then update popularity
            if(isSmall.length){
              database.Patterns.where('pattern').equals(splitter[0]).modify({"popularity": splitter[2]});
            }
          });
      }else{
        console.error(e.name + ': ' +e.message);
      }
      duplicates++;
      lineNumber++;
    });
  }
}).then(function(){
  //pass successful and unsuccessful records number to main thread.
  postMessage(addedRecords.toString() + "," + duplicates.toString());//use when you are using a web worker
  return;
}).catch(error => {
  console.error(error);
  return;
});