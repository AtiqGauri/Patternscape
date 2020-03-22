//REQUIRE DATABASE SCRIPT
var {database} = require('./scripts/databaseInit.js');
//REQUIRE DATABASE IMPORT EXPORT SCRIPT 
var importExportDB = require("./scripts/importExportDatabase.js");

//DECLARE A WEB WORKER
var worker;

/**
 * FUNCTION TO IMPORT DATA PROCESSED BY BACKEND (STATS) INTO APP DATABASE
 * FIRST CHECK IF THERE IS ANY INPUT FILE AVAILABLE IN FOLDER
 * IF TRUE THEN CALL WEB WORKER TO RUN BACKEND CODE
 */
function database_worker_client(){

    document.querySelector("#progressAnimation").style.display = "block";

    //if statement to avoid asar packaging path alteration
    if(fs.existsSync(path.join(process.resourcesPath, '..','data', 'Stats', 'Patterns Data'))){
		if(fs.readdirSync(path.join(process.resourcesPath, '..','data', 'Stats', 'Patterns Data')).length <= 1){
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">No file available to import</b>', cHtml='<b>First create some statistics using process tab operations, then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#B94955');
            document.querySelector("#progressAnimation").style.display = "none";
            return;
		}
	}else if(fs.existsSync(path.join(__dirname, '..','data', 'Stats', 'Patterns Data'))){
		if(fs.readdirSync(path.join(__dirname, '..','data', 'Stats', 'Patterns Data')).length <= 1){
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">No file available to import</b>', cHtml='<b>First create some statistics using process tab operations, then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#B94955');
            document.querySelector("#progressAnimation").style.display = "none";
            return;
        }
	}else{
        //if input is not available then warn user
        //>>APP_FOLDER/source/scripts/alerts.js<<
		database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">Import Error</b>', cHtml='<b>Import directory not found</b>', cIcon='error', cClass='databaseErrorAlerts', cTime=8000, cBColor='#B94955');
	}

    //initalizing web worker
    //if statement to make sure only thread run at a time
	if(worker==undefined){
		worker = new Worker('threadWorkers/databaseWorker.js');
	}else{
		return;
	}

    //listen to webworker signals
    worker.onmessage = function(event){

        //terminate worker
        worker.terminate();
        //set it to undefined
		worker = undefined;
        
        console.log(event.data);

        //references to reflect results
        var newlyAdded = document.querySelector("#importDbAdded");
        var duplicates = document.querySelector("#importDbDuplicates");
        var totalRecords = document.querySelector("#importDbTotal");
        
        //count database records 
        importExportDB.get_database_count().then(function(total) {
            //reflect status to GUI
            results = document.querySelector("#importDbResult");
            newlyAdded.innerHTML = 'Newly added records: ' + event.data.substring(0, event.data.indexOf(","));
            duplicates.innerHTML = 'Duplicates( ignored ): ' + event.data.substring(event.data.indexOf(",") + 1);
            totalRecords.innerHTML = 'Total Records: ' + total;
            
            document.querySelector("#progressAnimation").style.display = "none";
            
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_acknowledgment(cTarget='importDB', cTitle='Imported Successfully', cIcon='success', cClass='databaseImportAlert', cResult='importDbResult');
            
            //update storage quota in UI
            //>>APP_FOLDER/source/scripts/databaseClient.js<<
            database_storage_quota();
        });
    };

    //handle exception or error thrown by web worker
    worker.onerror = function (event){
        console.error(event.message, event);
        //terminate worker
        worker.terminate();
        //set it to undefined
		worker = undefined;
        //>>APP_FOLDER/source/scripts/alerts.js<<
        database_error_alerts(cTarget='importDB', cTitle='<b style="color:#B94955;">Import Error</b>', cHtml=event.message, cIcon='error', cClass='databaseErrorAlerts', cTime=60000, cBColor='#B94955');
    };
}

/**
 * STOP DATABASE IMPORT PROCESS IF REQUIRED
 */
function stop_database_import(){
    //close loading bar
	document.querySelector("#progressAnimation").style.display = "none";
    if(worker!=undefined){
        //terminate webworker
		worker.terminate();
        //set it to undefined
        worker = undefined;
        //popup to tell user worker is stopped
        //>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='importDB', cTitle='Stopped', cIcon='warning', cClass='databaseImportAlert');
	}else{
        //popup to tell user worker is undefined/empty
        //>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='importDB', cTitle='Empty', cIcon='info', cClass='databaseImportAlert');
	}
}


/**
 * FUNCTION TO EXPORT DATABASE INTO A JSON FILE.
 * CHECK >>APP_FOLDER/source/scripts/importExportDatabase.js<< FOR INNER WORKING
 */
function database_export_client(){

    //start loading bar
    document.querySelector("#progressAnimation").style.display = "block";
    
    //total exported records container
    var totalRecords = document.querySelector("#expTotal");

    //count total database records
    importExportDB.get_database_count().then(function(total) {
        //check if there is any record available
        if(total == 0){
            document.querySelector("#progressAnimation").style.display = "none";
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_error_alerts(cTarget='exportDB', cTitle='<b style="color:#499371;">Database is empty</b>', cHtml='<b>No records available to export</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#499371');
            return;
        }
        
        //call function to export database 
        //>>APP_FOLDER/source/scripts/importExportDatabase.js<<
        importExportDB.export_database().then((exportResult)=>{
            //close loading bar
            document.querySelector("#progressAnimation").style.display = "none";
            //reflect results in UI
            if(exportResult){
                totalRecords.innerHTML = 'Exported Records: ' + total;
                //>>APP_FOLDER/source/scripts/alerts.js<<
                database_acknowledgment(cTarget='exportDB', cTitle='Exported Successfully', cIcon='success', cClass='databaseExportAlert', cResult='expResultsDiv');
            }
        });
    });
}


/**
 * STOP DATABASE EXPORT PROCESS IF REQUIRED
 */
function stop_database_export(){
    
    //close loading bar
    document.querySelector("#progressAnimation").style.display = "none";
    //acknowledgment for user >>APP_FOLDER/source/scripts/alerts.js<<
    general_stop_alerts(cTarget='exportDB', cTitle='Stopped', cIcon='warning', cClass='databaseImportAlert');
}

/**
 * FUNCTION TO IMPORT DATABASE FROM A JSON FILE.
 * CHECK >>APP_FOLDER/source/scripts/importExportDatabase.js<< SCRIPT FOR WORKING PROCESS
 */
function database_import_client(){
    //start loading bar
    document.querySelector("#progressAnimation").style.display = "block";
    //get references to all result containers
    var newlyAdded = document.querySelector("#impDownAdded");
    var duplicates = document.querySelector("#impDownDuplicates");
    var totalRecords = document.querySelector("#impDownTotal");

    //Check if input is available in input folder
    //double if statements to avoid asar packaging 
    if(fs.existsSync(path.join(process.resourcesPath, '..', 'data', 'Database'))){
		if(fs.readdirSync(path.join(process.resourcesPath, '..', 'data', 'Database')).length <= 1){
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">No file available to import</b>', cHtml='<b>No database file available to import, please paste file inside "DATABASE INPUT FOLDER" and then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#5A81AE');
            document.querySelector("#progressAnimation").style.display = "none";
            return;
		}
	}else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Database'))){
		if(fs.readdirSync(path.join(__dirname, '..', 'data', 'Database')).length <= 1){
            //>>APP_FOLDER/source/scripts/alerts.js<<
            database_error_alerts(cTarget='importDownDB', cTitle='<b style="color:#5A81AE;">No file available to import</b>', cHtml='<b>No database file available to import, please paste file inside "DATABASE INPUT FOLDER" and then try again</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#5A81AE');
            document.querySelector("#progressAnimation").style.display = "none";
            return;
		}
	}else{
		console.error('data/Database/ folder doesn\'t exist');
	}

    //count total number of records available in database
    importExportDB.get_database_count().then(function(total1) {
        //call import function >>APP_FOLDER/source/scripts/importExportDatabase.js<<
        importExportDB.import_database().then((importResult)=>{
            //close loading bar
            document.querySelector("#progressAnimation").style.display = "none";
            //if operation was successful
            if(importResult){
                //count total number of database record AFTER IMPORTING MORE
                //The difference between previous count and new count will be-
                //-shown as newly added records
                importExportDB.get_database_count().then(function(total2){
                    //reflect results
                    newlyAdded.innerHTML = 'Newly added records: ' + (total2-total1);
                    totalRecords.innerHTML = 'Total Records: ' + total2;
                    //>>APP_FOLDER/source/scripts/alerts.js<<
                    database_acknowledgment(cTarget='importDownDB', cTitle='Imported Successfully', cIcon='success', cClass='databaseDownloadAlert', cResult='impDownResultsDiv');
                    document.querySelector('#impDownResultsDiv').style.display = "block";     
                });
            }
        });
    });
}

/**
 * STOP DOWNLOADED DATABASE IMPORT PROCESS IF REQUIRED
 */
function stop_down_database_import(){
    //close loading bar
    document.querySelector("#progressAnimation").style.display = "none";
    //acknowledge user >>APP_FOLDER/source/scripts/alerts.js<<
    general_stop_alerts(cTarget='importDownDB', cTitle='Stopped', cIcon='warning', cClass='databaseImportAlert');
}


/**
 * FUNCTION TO DELETE DATABASE.
 * USE THIS CAREFULLY OR EXPORT DATA BEFORE DELETING DATABASE.
 * ONCE DATABASE IS DELETED THEN USER WON'T BE ABLE TO ROLLBACK
 */
function delete_database(){
    var element = document.querySelector("#deleteIconWrapperID");
    //check if user has clicked on checkbox
    var classes = element.className.split(" ");
    var i = classes.indexOf("deleteIconActive");

    if (i >= 0){
        database.table('Patterns').clear().then(() => {
            //acknowledge user for success >>APP_FOLDER/source/scripts/alerts.js<<
            database_acknowledgment('deleteIconWrapperID', 'DATABASE IS DELETED', 'error', 'databaseDeleteAlert', 'deleteIconWrapperID'); 
            document.querySelector('#deleteIconWrapperID').click();
            //update storage quota in UI >>APP_FOLDER/source/scripts/alerts.js<<
            database_storage_quota();
        }).catch((error) => {
            database_error_alerts(cTarget='deleteIconWrapperID', cTitle='<b style="color:#5A81AE;">'+ error.name +'</b>', cHtml='<b>'+ error.message +'</b>', cIcon='warning', cClass='databaseErrorAlerts', cTime=8000, cBColor='#5A81AE');
        });
    }
    else{
        console.log("Check caution button to delete database");
        //Tell user that checkbox is required >>APP_FOLDER/source/scripts/alerts.js<<
        database_acknowledgment('deleteIconWrapperID', 'First check caution button to delete database', 'warning', 'databaseDeleteAlert', 'deleteIconWrapperID');
    }
    
}

/**
 * FUNCTION TO PERSIST DATABASE OF THE APP SO IT DON'T GET DELETED AUTOMATICALLY
 * OS DELETES DATABASE WHEN IT EXCEEDS QUOTA TO AVOID THAT WE PERSIST DATABASE
 * CHECK >>APP_FOLDER/source/scripts/importExportDatabase.js<< FOR INNER WORKING
 */
function persist_database(){
    
    //call import export script function >>APP_FOLDER/source/scripts/importExportDatabase.js<<
    var isPersisted = importExportDB.init_storage_persistence();
    
    //pass acknowledgment
    isPersisted.then(function(result){
        console.log('yes p');
        //>>APP_FOLDER/source/scripts/alerts.js<<
        database_acknowledgment('dataPersistance', result, 'success', 'databasePersistAlert', 'persistDataButton');
    });
}

/**
 * FUNCTION TO CHECK IF DATABASE IS PERSISTED
 * CHECK >>APP_FOLDER/source/scripts/importExportDatabase.js<< FOR INNER WORKING
 */
function is_database_persisted(){
    
    //call import export script function >>APP_FOLDER/source/scripts/importExportDatabase.js<<
    var isPersisted = importExportDB.is_storage_persisted();
    
    //pass acknowledgment
    isPersisted.then(function(value){
        console.log('Data is persisted : ' + value);
    });
}

/**
 * FUNCTION TO CHECK AVAILABLE SPACE
 * CHECK >>APP_FOLDER/source/scripts/importExportDatabase.js<< SCRIPT FOR WORKING PROCESS
 */
function database_storage_quota(){

    //call import export script function >>APP_FOLDER/source/scripts/importExportDatabase.js<<
    var data = importExportDB.show_estimated_quota();

    //pass information
    data.then(function(value){
        //reflect result in UI
        document.querySelector("#availableQuota").innerHTML = 'Using ' + (value.usage / value.quota * 100).toFixed(4)  + '% of Available Quota';
    });
}