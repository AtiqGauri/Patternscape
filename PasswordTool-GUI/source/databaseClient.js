//require database import export script 
var importExportDB = require("./importExportDatabase");

//declare a web worker
var worker;

/**
 * Function to import data processed by backend (stats) into app database
 */
function database_worker_client(){

    //reflect that process is started
    document.getElementById('statusDatabase').innerHTML = ('<p style="color:yellow;">Processing</p>');

    //initialize web worker
    worker = new Worker('./databaseWorker.js')

    //listen to webworker signals
    worker.onmessage = function(event){

        //print web worker acknowledgment then terminate it
        console.log("Database worker process is ", event.data);
        worker.terminate();
        
        //reflect status to GUI
        document.getElementById('statusDatabase').innerHTML = (event.data);
    };

    //handle exception or error thrown by web worker
    worker.onerror = function (event){
        console.error(event.message, event);  
    };
}

/**
 * Function to export database into a json file.
 * check importExportDatabase.js script for working process
 */
function database_export_client(){
    //call export function to import export script
    importExportDB.export_database();
}

/**
 * Function to import database from a json file.
 * check importExportDatabase.js script for working process
 */
function database_import_client(){
    //call import function to import export script
    importExportDB.import_database();
}

/**
 * Function to delete database.
 * use this carefully or export data before deleting database.
 */
function delete_database(){
    //WARNING: THIS WILL DELETE ALL THE DATABASES IN INDEXED_DB
    window.indexedDB.databases().then((r) => {
        for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
    }).then(() => {
        alert('Deleted database');
    });
}

/**
 * Function to persist database of the app so it don't get deleted automatically
 * check importExportDatabase.js script for working process
 */
function persist_database(){
    
    //call import export script function
    var isPersisted = importExportDB.init_storage_persistence();
    
    //pass acknowledgment
    isPersisted.then(function(value){
        console.log(value);
    });
}

/**
 * Function to check if database is persisted
 * check importExportDatabase.js script for working process
 */
function is_database_persisted(){
    
    //call import export script function
    var isPersisted = importExportDB.is_storage_persisted();
    
    //pass acknowledgment
    isPersisted.then(function(value){
        console.log('Data is persisted : ' + value);
    });
}

/**
 * Function to check available space
 * check importExportDatabase.js script for working process
 */
function database_storage_quota(){

    //call import export script function
    var data = importExportDB.show_estimated_quota();

    //pass information
    data.then(function(value){
        console.log('Available storage : '+value.quota + ' Used : ' + value.usage);
    });
}