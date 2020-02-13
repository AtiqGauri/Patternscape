//require database script
const {database} = require('./databaseInit.js');

//require package to export import database
require('dexie-export-import');

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
var export_database = async function export_database(){
    console.log("Exporting Database");
    try{
      const blob = await database.export({prettyJson: true});
      const text = await new Response(blob).text();
      fileSystem.writeFile("data/Database/ExportedDatabase.json", text, function(error){
        if(error){
          console.log(error);
        }
      });
    }catch(error){
        console.error(''+error);
        return;
    }
    console.log("Exported");
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
    console.log("Importing Database");
    const stream = fileSystem.createReadStream("data/Database/ExportedDatabase.json");
    const blob = await toBlob(stream);
    try{
        await database.import(blob);
    }catch(error){
        console.log('IMPORT ERROR: '+ error );
    }
    console.log("Imported");
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
      return "Not possible to persist storage";
    case "persisted":
      return "Successfully persisted storage silently";
    case "prompt":
      return "Not persisted, but we may prompt user when we want to.";
  }
}

module.exports = {
    export_database,
    import_database,
    init_storage_persistence,
    is_storage_persisted,
    show_estimated_quota,
}