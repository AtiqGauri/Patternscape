//require database script
const {database} = require('./databaseInit.js');
const {database_error_alerts} = require('./alerts.js');

//require package to export import database
//
require('dexie-export-import');
function exportSingleTable(db, tableName) {
  return exportDB(db, {filter: (tables, value, key) => tables === tableName});
}

//require package to convert stream into a blob
const toBlob = require('stream-to-blob');

//require fs package to handle file manipulation
var fileSystem = require('fs');

/**
 * Function to export database to a json file
 * Json file will be stored at data/Stats/ExportedDatabase.json
 * Step 1. make a blob of database data
 * Step 2. convert blob into a readable text form
 * Step 3. write normal text into json file
 * Step 4. acknowledgment
 */

 /**
  * 
      //const blob = await exportDB(database, {prettyJson: true, filter: (table, value, key) => table === 'Patterns'});
      const blob = await exportSingleTable(database, "Patterns").then( async (blob1) => {
        const text1 = await new Response(blob1).text();
        console.log(text1);
        // Result is in blob
      });
      const text = await new Response(blob).text();
  */
var export_database = async function export_database(){
    var operationSuccess = true;
    console.log("Exporting database");
    try{
      
      //const blob = await exportDB(database, {prettyJson: true, filter: (table, value, key) => table === 'Patterns'});
      const blob = await database.export({prettyJson: true, filter: (table, value, key) => table === 'Patterns'});
      const text = await new Response(blob).text();
      
      if(fs.existsSync(path.join(__dirname, '..', '..', 'data','Database'))){
        fileSystem.writeFile(path.join(__dirname, '..', '..', 'data','Database','ExportedDatabase.json'), text, function(error){
          if(error){
            console.log(error);
            operationSuccess = false;
            database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">'+ error.name +'</b>', cHtml=error.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
            return operationSuccess;
          }
        });
      }else if(fs.existsSync(path.join(process.resourcesPath, '..', 'data','Database'))){
        fileSystem.writeFile(path.join(process.resourcesPath, '..', 'data','Database','ExportedDatabase.json'), text, function(error){
          if(error){
            console.log(error);
            operationSuccess = false;
            database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">'+ error.name +'</b>', cHtml=error.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
            return operationSuccess;
          }
        });
      }else{
        operationSuccess = false;
        database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">Export Error</b>', cHtml='Export directory not found', cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
        return operationSuccess;
      }
    }catch(error){
        console.error(''+error);
        operationSuccess = false;
        database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">'+ error.name +'</b>', cHtml=error.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#499371');
        return operationSuccess;
    }
    console.log("Exported");
    return operationSuccess;
};

/**
 * Function to import database
 * database will be imported from json file located at data/Stats/ExportedDatabase.json
 * Step 1. make a stream of file data
 * Step 2. convert stream into a package
 * Step 3. try to add blob into database
 * Step 4. acknowledgment
 */
var import_database = async function import_database(){
    var operationSuccess = true;
    
    var downloadedInputFiles = [];

    if(fs.existsSync(path.join(__dirname, '..', '..', 'data','Database'))){
      fileSystem.readdirSync(path.join(__dirname, '..', '..', 'data','Database')).forEach(file => {
        if(file != 'Error Log'){
          downloadedInputFiles.push(path.join('data', 'Database', file));
        }
      });  
    }else if(fs.existsSync(path.join(process.resourcesPath, '..', 'data','Database'))){
      fileSystem.readdirSync(path.join(process.resourcesPath, '..', 'data','Database')).forEach(file => {
        if(file != 'Error Log'){
          downloadedInputFiles.push(path.join('data', 'Database', file));
        }
      });
    }else{
      operationSuccess = false;
      database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">Import Error</b>', cHtml='<b>Import directory not found</b>', cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#5A81AE');
      return operationSuccess;
    }

    for (let i = 0; i < downloadedInputFiles.length; i++) {
      try{
        const stream = fileSystem.createReadStream(downloadedInputFiles[i]);
        const blob = await toBlob(stream);
        await database.import(blob, {prettyJson: true, filter: (table, value, key) => table === 'Patterns'});
      }catch(error){
        if(error.name === "BulkError"){
          console.log('IMPORT ERROR: '+ error.message);
        }else{
          console.log('IMPORT ERROR: '+ error );
          operationSuccess = false;
          database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">' + error.name + '</b>', cHtml='<b>'+error.message+'</b>', cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#5A81AE');
        }
        /**
         * 
         .catch(Dexie.BulkError, function (e) {
            // Explicitely catching the bulkAdd() operation makes those successful
            // additions commit despite that there were errors.
            console.error ("Some raindrops did not succeed. However, " +
                100000-e.failures.length + " raindrops was added successfully");
          });
         */
      }
    }
    database_storage_quota();
    return operationSuccess;
};


/** Check if storage is persisted already.
  //@returns {Promise<boolean>} Promise resolved with true if current origin is
  using persistent storage, false if not, and undefined if the API is not
  present.
*/
async function is_storage_persisted() {
  return await navigator.storage && navigator.storage.persisted ?
    navigator.storage.persisted() :
    undefined;
}


/** Queries available disk quota.
  @see https://developer.mozilla.org/en-US/docs/Web/API/StorageEstimate
  @returns {Promise<{quota: number, usage: number}>} Promise resolved with
  {quota: number, usage: number} or undefined.
*/
async function show_estimated_quota() {
    return await navigator.storage && navigator.storage.estimate ?
      navigator.storage.estimate() :
      undefined;
}

/** Tries to convert to persisted storage.
  @returns {Promise<boolean>} Promise resolved with true if successfully
  persisted the storage, false if not, and undefined if the API is not present.
*/
async function persist() {
    return await navigator.storage && navigator.storage.persist ?
      navigator.storage.persist() :
      undefined;
}


/** Tries to persist storage without ever prompting user.
  @returns {Promise<string>}
    "never" In case persisting is not ever possible. Caller don't bother
      asking user for permission.
    "prompt" In case persisting would be possible if prompting user first.
    "persisted" In case this call successfully silently persisted the storage,
      or if it was already persisted.
*/
async function try_persist_without_promting_user() {
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
 * function to pass status of persisting data operation
 */
var init_storage_persistence = async function init_storage_persistence() {
  console.log("persisting data");
  const persist = await try_persist_without_promting_user();
  switch (persist) {
    case "never":
      return "No space to persist database";
    case "persisted":
      return "Successfully persisted database silently";
    case "prompt":
      return "Not persisted, but we may prompt user";
  }
}

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