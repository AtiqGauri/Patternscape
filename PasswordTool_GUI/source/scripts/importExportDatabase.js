//REQUIRE DATABASE SCRIPT
const {database} = require('./databaseInit.js');
const {database_error_alerts} = require('./alerts.js');

//REQUIRE PACKAGE TO EXPORT IMPORT DATABASE
require('dexie-export-import');

//REQUIRE PACKAGE TO CONVERT STREAM INTO A BLOB
const toBlob = require('stream-to-blob');

//REQUIRE FS PACKAGE TO HANDLE FILE MANIPULATION
const fileSystem = require('fs');
const path = require('path');

/**
 * FUNCTION TO EXPORT DATABASE TO A JSON FILE
 * JSON FILE WILL BE STORED AT >>APP_FOLDER/data/Stats/ExportedDatabase.json<<
 * STEP 1. MAKE A BLOB OF DATABASE DATA
 * STEP 2. CONVERT BLOB INTO A READABLE TEXT FORM
 * STEP 3. WRITE NORMAL TEXT INTO JSON FILE
 * STEP 4. ACKNOWLEDGMENT
 */
var export_database = async function export_database(){
    var operationSuccess = true;
    console.log("Exporting database");
    try{
      //create blob of database and then convert it in plain text
      const blob = await database.export({prettyJson: true, filter: (table, value, key) => table === 'Patterns'});
      const text = await new Response(blob).text();
      
      //check if file exist or make a new one
      //double if statement to avoid asar packaging address alteration
      if(fs.existsSync(path.join(__dirname, '..', '..', 'data','Database'))){
        fileSystem.writeFile(path.join(__dirname, '..', '..', 'data','Database','ExportedDatabase.json'), text, function(error){
          if(error){
            console.log(error);
            operationSuccess = false;
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">'+ error.name +'</b>', cHtml=error.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
            return operationSuccess;
          }
        });
      }else if(fs.existsSync(path.join(process.resourcesPath, '..', 'data','Database'))){
        fileSystem.writeFile(path.join(process.resourcesPath, '..', 'data','Database','ExportedDatabase.json'), text, function(error){
          if(error){
            console.log(error);
            operationSuccess = false;
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">'+ error.name +'</b>', cHtml=error.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
            return operationSuccess;
          }
        });
      }else{
        operationSuccess = false;
        //>>APP_FOLDER/source/scripts/alerts.js<<
        database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">Export Error</b>', cHtml='Export directory not found', cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
        return operationSuccess;
      }
    }catch(error){
        console.error(''+error);
        operationSuccess = false;
        //>>APP_FOLDER/source/scripts/alerts.js<<
        database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">'+ error.name +'</b>', cHtml=error.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
        return operationSuccess;
    }
    console.log("Exported");
    return operationSuccess;
};

/**
 * FUNCTION TO IMPORT DATABASE
 * DATABASE WILL BE IMPORTED FROM JSON FILES AVAILABLE IN >>APP_FOLDER/data/Stats/<< FOLDER
 * STEP 1. MAKE A STREAM OF FILE DATA
 * STEP 2. CONVERT STREAM INTO A PACKAGE
 * STEP 3. TRY TO ADD BLOB INTO DATABASE
 * STEP 4. ACKNOWLEDGMENT
 */
var import_database = async function import_database(){
    var operationSuccess = true;
    //array to collect address of all available input file
    var downloadedInputFiles = [];

    //check if any input file is available in input folder
    //double if statement to avoid asar packaging address alteration
    if(fs.existsSync(path.join(__dirname, '..', '..', 'data','Database'))){
      fileSystem.readdirSync(path.join(__dirname, '..', '..', 'data','Database')).forEach(file => {
        if(file != 'Error Log' && file != '.DS_Store'){
          downloadedInputFiles.push(path.join('data', 'Database', file));
        }
      });  
    }else if(fs.existsSync(path.join(process.resourcesPath, '..', 'data','Database'))){
      fileSystem.readdirSync(path.join(process.resourcesPath, '..', 'data','Database')).forEach(file => {
        if(file != 'Error Log' && file != '.DS_Store'){
          downloadedInputFiles.push(path.join(process.resourcesPath, '..', 'data', 'Database', file));
        }
      });
    }else{
      operationSuccess = false;
      //>>APP_FOLDER/source/scripts/alerts.js<<
      database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">Import Error</b>', cHtml='<b>Import directory not found</b>', cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#5A81AE');
      return operationSuccess;
    }
    
    //iterate over each file try to import it
    for (let i = 0; i < downloadedInputFiles.length; i++) {
      try{
        //make a stream of input file
        const stream = fileSystem.createReadStream(downloadedInputFiles[i]);
        //change it in blob
        const blob = await toBlob(stream);
        //import above blob in database
        await database.import(blob, {prettyJson: true, overwriteValues: true, filter: (table, value, key) => table === 'Patterns'});
      }catch(error){
        //if BulkError(key already exist) then just move on
        if(error.name === "BulkError"){
          console.log('IMPORT ERROR: '+ error.message);
          //console.log(error.failures);
        }else{
          console.log('IMPORT ERROR: '+ error );
          operationSuccess = false;
          database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">' + error.name + '</b>', cHtml='<b>'+error.message+'</b>', cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#5A81AE');
        }
      }
    }
    database_storage_quota();
    return operationSuccess;
};


/** CHECK IF STORAGE IS PERSISTED ALREADY.
  //@returns {Promise<boolean>} PROMISE RESOLVED WITH TRUE IF CURRENT ORIGIN IS
  USING PERSISTENT STORAGE, FALSE IF NOT, AND UNDEFINED IF THE API IS NOT
  PRESENT.
*/
async function is_storage_persisted() {
  return await navigator.storage && navigator.storage.persisted ?
    navigator.storage.persisted() :
    undefined;
}


/** QUERIES AVAILABLE DISK QUOTA.
  @see https://developer.mozilla.org/en-US/docs/Web/API/StorageEstimate
  @returns {Promise<{quota: number, usage: number}>} PROMISE RESOLVED WITH
  {quota: number, usage: number} OR UNDEFINED.
*/
async function show_estimated_quota() {
    return await navigator.storage && navigator.storage.estimate ?
      navigator.storage.estimate() :
      undefined;
}

/** TRIES TO CONVERT TO PERSISTED STORAGE.
  @returns {Promise<boolean>} PROMISE RESOLVED WITH TRUE IF SUCCESSFULLY
  PERSISTED THE STORAGE, FALSE IF NOT, AND UNDEFINED IF THE API IS NOT PRESENT.
*/
async function persist() {
    return await navigator.storage && navigator.storage.persist ?
      navigator.storage.persist() :
      undefined;
}


/** TRIES TO PERSIST STORAGE WITHOUT EVER PROMPTING USER.
  @returns {Promise<string>}
    "NEVER" IN CASE PERSISTING IS NOT EVER POSSIBLE. CALLER DON'T BOTHER
      ASKING USER FOR PERMISSION.
    "PROMPT" IN CASE PERSISTING WOULD BE POSSIBLE IF PROMPTING USER FIRST.
    "PERSISTED" IN CASE THIS CALL SUCCESSFULLY SILENTLY PERSISTED THE STORAGE,
      OR IF IT WAS ALREADY PERSISTED.
*/
async function try_persist_without_prompting_user() {
    if (!navigator.storage || !navigator.storage.persisted) {
      return "never";
    }
    let persisted = await navigator.storage.persisted();
    if (persisted) {
      return "persisted";
    }
    if (!navigator.permissions || !navigator.permissions.query) {
      return "prompt"; // It MAY be successful to prompt. Don't know.
    }
    const permission = await navigator.permissions.query({
      name: "persistent-storage"
    });
    if (permission.status === "granted") {
      persisted = await navigator.storage.persist();
      if (persisted) {
        return "persisted";
      } else {
        throw new Error("Failed to persist");
      }
    }
    if (permission.status === "prompt") {
      return "prompt";
    }
    return "never";
}
  
/**
 * FUNCTION TO PASS STATUS OF PERSISTING DATA OPERATION
 */
var init_storage_persistence = async function init_storage_persistence() {
  console.log("persisting data");
  const persist = await try_persist_without_prompting_user();
  switch (persist) {
    case "never":
      return "No space to persist database";
    case "persisted":
      return "Successfully persisted database silently";
    case "prompt":
      return "Not persisted, but we may prompt user";
  }
}

/**
 * returns total number of records present
 * in Patterns table of database
 */
async function get_database_count(){
  return await database.table('Patterns').count();
}

module.exports = {
    export_database,
    import_database,
    init_storage_persistence,
    is_storage_persisted,
    show_estimated_quota,
    get_database_count,
}