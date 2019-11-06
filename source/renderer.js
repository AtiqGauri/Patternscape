// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const path = require('path');
const shell = require('electron').shell;
const { get_address_of_pattern_file } = require('./database.js');

function input_of_anlyzing(){
	
	//*DEVELOPMENT* If you are developing app use below code and comment others
	shell.openItem(path.join(__dirname, '..','data', 'Input'));
	
	//*PRODUCTION* Production app should use below code and comment the above one
	//shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Input'));
	
	//alert sound should be played finally in all conditions
	shell.beep();
}

function output_of_anlyzing(){
	
	//*DEVELOPMENT* If you are developing app use below code and comment others
	shell.openItem(path.join(__dirname, '..','data', 'Output'));
	
	//*PRODUCTION* Production app should use below code and comment the above one
	//shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Output'));
	
	//alert sound should be played finally in all conditions
	shell.beep();
}

function input_of_stats_generator(){
	
	//*DEVELOPMENT* If you are developing app use below code and comment others
	shell.openItem(path.join(__dirname, '..','data', 'Output'));
	
	//*PRODUCTION* Production app should use below code and comment the above one
	//shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Output'));
	
	//alert sound should be played finally in all conditions
	shell.beep();
}

function output_of_stats_generator(){
	
	//*DEVELOPMENT* If you are developing app use below code and comment others
	shell.openItem(path.join(__dirname, '..','data', 'Stats', 'Patterns Data'));
	shell.openItem(path.join(__dirname, '..','data', 'Stats', 'Patterns.txt'));

	//*PRODUCTION* Production app should use below code and comment the above one
	//shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns Data'));
	//shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns.txt'));
	
	//alert sound should be played finally in all conditions
	shell.beep();
}

function pattern_lookup(){
	
	var input = document.getElementById("patternBar").value;
	get_address_of_pattern_file(input).then(function(result) {

		for (i = 0; i < result.length; i++) {
			
			//*DEVELOPMENT* If you are developing app use below code and comment others
			shell.openItem(path.join(__dirname, '..',result[i]));
			
			//*PRODUCTION* Production app should use below code and comment the above one
			//shell.openItem(path.join(__dirname, '..', '..', '..', result[i]));
		}
	});
}

/*
function listOutput(){
  var files = fs.readdirSync('./data/Output/');
  var docFrag = document.createDocumentFragment();
  for (var i=0; i < files.length ; i++){
  	if(files[i]== "ErrorLogs.txt"){
  		continue;
  	}
	var elem = document.createElement('input');
	elem.type = 'button';
	elem.value = i;
	elem.id = files[i];
	elem.classList.add("button");
	elem.addEventListener('click', function(event){
	newWindow(this.id);
	})
	docFrag.appendChild(elem);
  }
  list.appendChild(docFrag);
}
*/

