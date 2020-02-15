//require database import export script 
var importExportDB = require("./scripts/importExportDatabase.js");

//declare a web worker
var worker;

/**
 * Function to import data processed by backend (stats) into app database
 */
function database_worker_client(){
    document.getElementById("progressAnimation").style.display = "block";

    //initialize web worker
    worker = new Worker('threadWorkers/databaseWorker.js')

    //listen to webworker signals
    worker.onmessage = function(event){

        //terminate worker
        worker.terminate();
        
        console.log(event.data);

        var newlyAdded = document.getElementById("importDbAdded");
        var duplicates = document.getElementById("importDbDuplicates");
        var totalRecords = document.getElementById("importDbTotal");
        importExportDB.get_database_count().then(function(total) {
            //reflect status to GUI
            results = document.getElementById("importDbResult");
            newlyAdded.innerHTML = 'Newly added records: ' + event.data.substring(0, event.data.indexOf(","));
            duplicates.innerHTML = 'Duplicates( ignored ): ' + event.data.substring(event.data.indexOf(",") + 1);
            totalRecords.innerHTML = 'Total Records: ' + total;
            
            document.getElementById("progressAnimation").style.display = "none";
            
            results.style.display = "block";
            //hide results after certain seconds
            setTimeout(function(){ 
                results.style.display = "none";
            }, 6000);
        });
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
    document.getElementById("progressAnimation").style.display = "block";
    //call export function to import export script
    importExportDB.export_database();
    var totalRecords = document.getElementById("expTotal");
    importExportDB.get_database_count().then(function(total) {
        //reflect status to GUI
        results = document.getElementById("expResultsDiv");
        totalRecords.innerHTML = 'Exported Records: ' + total;
        
        document.getElementById("progressAnimation").style.display = "none";
        
        results.style.display = "block";
        //hide results after certain seconds
        setTimeout(function(){ 
            results.style.display = "none";
        }, 6000);
    });
}

/**
 * Function to import database from a json file.
 * check importExportDatabase.js script for working process
 */
function database_import_client(){
    document.getElementById("progressAnimation").style.display = "block";
    
    var newlyAdded = document.getElementById("impDownAdded");
    var duplicates = document.getElementById("impDownDuplicates");
    var totalRecords = document.getElementById("impDownTotal");
    //reflect status to GUI
    results = document.getElementById("impDownResultsDiv");

    importExportDB.get_database_count().then(function(total1) {
        console.log(total1);
        //call import function to import export script
        importExportDB.get_database_count().then(function(total2){
            newlyAdded.innerHTML = 'Newly added records: ' + (total2-total1);
            totalRecords.innerHTML = 'Total Records: ' + total2;
            
            document.getElementById("progressAnimation").style.display = "none";
            
            results.style.display = "block";
            //hide results after certain seconds
            setTimeout(function(){ 
                results.style.display = "none";
            }, 6000);
        });
    });
}


/**
 * Function to delete database.
 * use this carefully or export data before deleting database.
 */
function delete_database(){
    var element = document.getElementById("deleteIconWrapperID");
    
    var classes = element.className.split(" ");
    var i = classes.indexOf("deleteIconActive");

    if (i >= 0){
        /* 
        //WARNING: THIS WILL DELETE ALL THE DATABASES IN INDEXED_DB
        window.indexedDB.databases().then((r) => {
            for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
        }).then(() => {
            console.log('Database is deleted');
        });
        */
        console.log("deleted Database"); 
    }
    else{
        console.log("Check caution button to delete database");
    }
    
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