var importExportDB = require("./importExportDatabase");

var worker;
function database_worker_client(){
    worker = new Worker('./databaseWorker.js')

    worker.onmessage = function(event){
        console.log("Database worker process is ", event.data);
        worker.terminate();
        document.getElementById('statusDatabase').innerHTML = (event.data);
        //console.log("worker is done working ");
    };

    worker.onerror = function (event){
        console.error(event.message, event);  
    };
}

function database_export_client(){
    importExportDB.export_database();
}

function database_import_client(){
    importExportDB.import_database();
}

function delete_database(){
    //WARNING: THIS WILL DELETE ALL THE DATABASES IN INDEXED_DB
    window.indexedDB.databases().then((r) => {
        for (var i = 0; i < r.length; i++) window.indexedDB.deleteDatabase(r[i].name);
    }).then(() => {
        alert('Deleted database');
    });
}

function persist_database(){
    var isPersisted = importExportDB.init_storage_persistence();
    isPersisted.then(function(value){
        console.log(value);
    });
}

function is_database_persisted(){
    var isPersisted = importExportDB.is_storage_persisted();
    isPersisted.then(function(value){
        console.log('Data is persisted : ' + value);
    });
}

function database_storage_qouta(){
    var data = importExportDB.show_estimated_quota();
    data.then(function(value){
        console.log('Available storage : '+value.quota + ' Used : ' + value.usage);
    });
}

function pattern_lookup(){
	//shell.openItem(path.join(__dirname, '..','data', 'Stats', 'Patterns.txt'));
	var input = document.getElementById("patternBar").value;
	console.log(input);
}
