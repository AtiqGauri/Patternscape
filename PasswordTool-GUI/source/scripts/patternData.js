//require path package to handle file addresses
const path = require('path');
//require file system
const fs = require('fs');
//require n-readlines to read huge file line by line without excessive use of memory 
const lineByLine = require('n-readlines');
//to communicate with parent window
const ipc = require('electron').ipcRenderer;

// When document has loaded, initialized
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};


//variable to denote single line string
let line;
//splitter will be used to split string in tokens
var splitter;

//get pattern text element to reflect file pattern string
var pattern = document.getElementById('patternText');
//variable to count number of values in a pattern.
//variable to count popularity of a pattern
var patternTagCounter, popularityCounter=0;

//get unordered list element to add rows in it
var ulContainer = document.getElementById('passwordList'); 
//variables required to make a row 
var li, ul, dt, dd, splitter, i;

//catch the pattern data file address sent by parent windows 
ipc.on('message', (event, patternString, fileAddress) => {
    
    //reflect file pattern string
    pattern.innerHTML += patternString;

    
    //initialize n-readlines with data file address
    //double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(__dirname, '..', '..', '..', '..', fileAddress))){
        var liner = new lineByLine(path.join(__dirname, '..', '..', '..', '..', fileAddress));
    }else if(fs.existsSync(path.join(__dirname, '..', '..', fileAddress))){
        var liner = new lineByLine(path.join(__dirname, '..', '..', fileAddress));
    }else{
        console.error(fileAddress + ' file doesn\'t exist');
    }

    //count number of forward slash in pattern string to get number of tags(name, dob, etc) in it.
    patternTagCounter = (patternString.match(/\//g)).length;

    //loop to iterate over file
    while(line = liner.next()){
        
        //this will split password and it detected parts in tokens
        splitter = line.toString().split('<|>');

        //Create list element, This represents a single password and its associated data.
        li = document.createElement('li');
        
        //reflect password
        li.innerHTML = 'Password: ' + splitter[0];
        li.style.padding = "2% 0% 2% 3%";
        li.style.textShadow = "1px 1px 1px rgba(255, 255, 255, 1)";
        
        //Create ul element, this will contain all the detected parts of password.
        ul = document.createElement('ul');

        //loop to iterate over all the detected parts of password
        for(i=0; i<patternTagCounter; i++){

            //Create dt element, this will represent a single value(detected part)
            dt = document.createElement('dt');
            //reflect dt value
            dt.innerHTML = splitter[1 + (i*2)];
            
            //Create dd element, this will represent properties(length, position) associated to detected part
            dd = document.createElement('dd');
            //reflect dd value
            dd.innerHTML = splitter[1 + (i*2) + 1];
            
            //append elements to their parents
            ul.appendChild(dt);
            ul.appendChild(dd);
        }
        li.appendChild(ul);
        ulContainer.appendChild(li);

        //increase popularity counter
        popularityCounter++;
    }
    //reflect popularity
    document.getElementById('popularityText').innerHTML = 'Popularity: ' + popularityCounter;
})


function handleWindowControls() {

	let patternDataWin = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.getElementById('minWindowDiv').addEventListener("click", event => {
        patternDataWin.minimize();
    });

    document.getElementById('maxWindowDiv').addEventListener("click", event => {
        patternDataWin.maximize();
    });

    document.getElementById('restoreWindowDiv').addEventListener("click", event => {
        patternDataWin.unmaximize();
    });

    document.getElementById('closeWindowDiv').addEventListener("click", event => {
        patternDataWin.close();
    });

    function toggleMaxRestoreButtons() {
        if (patternDataWin.isMaximized()) {
			//document.body.classList.add('maximized');
			document.getElementById('maxWindowDiv').style.display = 'none';
			document.getElementById('restoreWindowDiv').style.display = 'block';
        } else {
			//document.body.classList.remove('maximized');
			document.getElementById('maxWindowDiv').style.display = 'block';
			document.getElementById('restoreWindowDiv').style.display = 'none';
        }
    }

    // Toggle maximize/restore buttons when maximization/unmaximization occurs
    toggleMaxRestoreButtons();
    patternDataWin.on('maximize', toggleMaxRestoreButtons);
    patternDataWin.on('unmaximize', toggleMaxRestoreButtons);
}


function platformWindowControl(){
    document.getElementById("windowControls").style.visibility = 'visible';
    if(process.platform == 'darwin'){
        document.getElementById("windowControls").classList.add("forMac");
        document.getElementById("minWindowDiv").style.order = '2';
        document.getElementById("maxWindowDiv").style.order = '3';
        document.getElementById("restoreWindowDiv").style.order = '3';
        document.getElementById("closeWindowDiv").style.order = '1';
    }else{
        document.getElementById("windowControls").classList.add("forElse");
    }
}