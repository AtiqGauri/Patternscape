// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

const path = require('path');
const shell = require('electron').shell;
const { get_address_of_pattern_file } = require('./database.js');

//*DEVELOPMENT or PRODUCTION* If you are developing the app use then true else false
const isDevMode = true;

function input_of_anlyzing(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Input'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Input'));
	}

	//alert sound should be played finally in all conditions
	shell.beep();
}

function output_of_anlyzing(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Output'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Output'));
	}

	//alert sound should be played finally in all conditions
	shell.beep();
}

function input_of_stats_generator(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Output'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Output'));
	}

	//alert sound should be played finally in all conditions
	shell.beep();
}

function output_of_stats_generator(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Stats', 'Patterns Data'));
		shell.openItem(path.join(__dirname, '..','data', 'Stats', 'Patterns.txt'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns Data'));
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns.txt'));
	}

	//alert sound should be played finally in all conditions
	shell.beep();
}

function pattern_lookup(){
	
	var input = document.getElementById("patternBar").value;
	get_address_of_pattern_file(input).then(function(result) {

		for (i = 0; i < result.length; i++) {
			
			if(isDevMode){
				shell.openItem(path.join(__dirname, '..',result[i]));
			} else {
				shell.openItem(path.join(__dirname, '..', '..', '..', result[i]));
			}
			//alert sound should be played finally in all conditions
			shell.beep();
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

