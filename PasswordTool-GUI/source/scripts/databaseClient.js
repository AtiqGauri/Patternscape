//require database script
var {database} = require('./scripts/databaseInit.js');
//require database import export script 
var importExportDB = require("./scripts/importExportDatabase.js");

//declare a web worker
var worker;

/**
 * Function to import data processed by backend (stats) into app database
 */
function database_worker_client(){

    document.getElementById("progressAnimation").style.display = "block";

    if(fs.existsSync(path.join(process.resourcesPath, '..','data', 'Stats', 'Patterns Data'))){
		if(fs.readdirSync(path.join(process.resourcesPath, '..','data', 'Stats', 'Patterns Data')).length <= 1){
			database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">No file available to import</b>', cHtml='<b>First create some statistics using process tab operations, then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#B94955');
            document.getElementById("progressAnimation").style.display = "none";
            return;
		}
	}else if(fs.existsSync(path.join(__dirname, '..','data', 'Stats', 'Patterns Data'))){
		if(fs.readdirSync(path.join(__dirname, '..','data', 'Stats', 'Patterns Data')).length <= 1){
            database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">No file available to import</b>', cHtml='<b>First create some statistics using process tab operations, then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#B94955');
            document.getElementById("progressAnimation").style.display = "none";
            return;
		}
	}else{
		database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">Import Error</b>', cHtml='<b>Import directory not found</b>', cIcon='error', cClass='databaseErrorAlerts', cTime=8000, cBColor='#B94955');
	}


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
            
            database_storage_quota();
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
    importExportDB.get_database_count().then(function(total) {
        if(total == 0){
            document.getElementById("progressAnimation").style.display = "none";
            database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">Database is empty</b>', cHtml='<b>No records available to export</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#499371');
            return;
        }
        
        importExportDB.export_database().then((exportResult)=>{
            document.getElementById("progressAnimation").style.display = "none";
            if(exportResult){
                totalRecords.innerHTML = 'Exported Records: ' + total;
                database_acknowledgment(cTarget='exportDB', cTitle='Exported Successfully', cIcon='success', cClass='databaseExportAlert', cResult='expResultsDiv');
            }
        });
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

    if(fs.existsSync(path.join(process.resourcesPath, '..', 'data', 'Database'))){
		if(fs.readdirSync(path.join(process.resourcesPath, '..', 'data', 'Database')).length <= 1){
			database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">No file available to import</b>', cHtml='<b>No database file available to import, please paste file inside "DATABASE INPUT FOLDER" and then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#5A81AE');
            document.getElementById("progressAnimation").style.display = "none";
            return;
		}
	}else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Database'))){
		if(fs.readdirSync(path.join(__dirname, '..', 'data', 'Database')).length <= 1){
            database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">No file available to import</b>', cHtml='<b>No database file available to import, please paste file inside "DATABASE INPUT FOLDER" and then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#5A81AE');
            document.getElementById("progressAnimation").style.display = "none";
            return;
		}
	}else{
		console.error('data/Database/ folder doesn\'t exist');
	}

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
        database.table('Patterns').clear().then(() => {
            database_acknowledgment('deleteIconWrapperID', 'DATABASE IS DELETED', 'error', 'databaseDeleteAlert', 'deleteIconWrapperID'); 
            document.getElementById('deleteIconWrapperID').click();
            database_storage_quota();
        }).catch((error) => {
            database_error_alerts(cTarget='deleteIconWrapperID', cTitle='<b style="color:#5A81AE;">'+ error.name +'</b>', cHtml='<b>'+ error.message +'</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#5A81AE');
        });
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