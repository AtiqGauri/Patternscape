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
            
            database_acknowledgment(cTarget='importDB', cTitle='Imported Successfully', cIcon='success', cClass='databaseImportAlert', cResult='importDbResult');
        });
    };

    //handle exception or error thrown by web worker
    worker.onerror = function (event){
        console.error(event.message, event);
        database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">Import Error</b>', cHtml=event.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#B94955');
    };
}

/**
 * stop database import process if required
 */
function stop_database_import(){
    
	document.getElementById("progressAnimation").style.display = "none";
    if(worker!=undefined){
        //terminate webworker
		worker.terminate();
        //set it to undefined
		worker = undefined;
		general_stop_alerts(cTarget='importDB', cTitle='Stopped', cIcon='warning', cClass='databaseImportAlert');
	}else{
		general_stop_alerts(cTarget='importDB', cTitle='Empty', cIcon='info', cClass='databaseImportAlert');
	}
}


/**
 * Function to export database into a json file.
 * check importExportDatabase.js script for working process
 */
function database_export_client(){
    document.getElementById("progressAnimation").style.display = "block";
    
    var totalRecords = document.getElementById("expTotal");

    //call export function to import export script
    importExportDB.export_database().then((exportResult)=>{
        document.getElementById("progressAnimation").style.display = "none";
        if(exportResult){
            importExportDB.get_database_count().then(function(total) {
                totalRecords.innerHTML = 'Exported Records: ' + total;
                database_acknowledgment(cTarget='exportDB', cTitle='Exported Successfully', cIcon='success', cClass='databaseExportAlert', cResult='expResultsDiv');
            });
        }
    });
}
/**
 * stop database export process if required
 */
function stop_database_export(){
    
    document.getElementById("progressAnimation").style.display = "none";
    
    general_stop_alerts(cTarget='exportDB', cTitle='Stopped', cIcon='warning', cClass='databaseImportAlert');
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

    importExportDB.get_database_count().then(function(total1) {
        console.log(total1);
        //call import function to import export script
        importExportDB.import_database().then((importResult)=>{
            document.getElementById("progressAnimation").style.display = "none";
            if(importResult){
                importExportDB.get_database_count().then(function(total2){
                    newlyAdded.innerHTML = 'Newly added records: ' + (total2-total1);
                    totalRecords.innerHTML = 'Total Records: ' + total2;
                    database_acknowledgment(cTarget='importDownDB', cTitle='Imported Successfully', cIcon='success', cClass='databaseDownloadAlert', cResult='impDownResultsDiv');
                    document.getElementById('impDownResultsDiv').style.display = "block";     
                });
            }
        });
    });
}
/**
 * stop downloaded database import process if required
 */
function stop_down_database_import(){
    
    document.getElementById("progressAnimation").style.display = "none";
    
    general_stop_alerts(cTarget='importDownDB', cTitle='Stopped', cIcon='warning', cClass='databaseImportAlert');
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
        database_acknowledgment('deleteIconWrapperID', 'DATABASE IS DELETED', 'error', 'databaseDeleteAlert', 'deleteIconWrapperID');
    }
    else{
        console.log("Check caution button to delete database");
        database_acknowledgment('deleteIconWrapperID', 'First check caution button to delete database', 'warning', 'databaseDeleteAlert', 'deleteIconWrapperID');
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
    isPersisted.then(function(result){
        database_acknowledgment('dataPersistance', result, 'success', 'databasePersistAlert', 'persistDataButton');
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
        document.getElementById("availableQuota").innerHTML = 'Using ' + (value.usage / value.quota * 100).toFixed(4)  + '% of Available Quota';
    });
}