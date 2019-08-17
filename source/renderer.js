// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
//const { hello } 
//var myModule = require("../t-addon");


//var myModule = require('electron').remote.require('./build/resources/predictor-addon')
//const h1 = document.querySelector("h1");
//h1.innerHTML = (
//			'<p style="text-align:center"> This is C++ Module: ' +
//			myModule.hello() +
//			'</p>'
//	);

const path = require('path');
const fs = require('fs');
const shell = require('electron').shell;

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

function newWindow(id){
  shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Output',id));
}


//shell.openItem(path.join(__dirname, '../../../data/Output/'+id));