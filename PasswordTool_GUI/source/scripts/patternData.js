//REQUIRE PATH PACKAGE TO HANDLE FILE ADDRESSES
const path = require('path');
//REQUIRE FILE SYSTEM
const fs = require('fs');
//REQUIRE N-READLINES TO READ HUGE FILE LINE BY LINE WITHOUT EXCESSIVE USE OF MEMORY 
const lineByLine = require('n-readlines');
//TO COMMUNICATE WITH PARENT WINDOW
const ipc = require('electron').ipcRenderer;

// WHEN DOCUMENT HAS LOADED, INITIALIZED
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};


//VARIABLE TO DENOTE SINGLE LINE STRING
let line;
//SPLITTER WILL BE USED TO SPLIT STRING IN TOKENS
var splitter;

//GET PATTERN TEXT ELEMENT TO REFLECT FILE PATTERN STRING
var pattern = document.querySelector('#patternText');
//VARIABLE TO COUNT NUMBER OF VALUES IN A PATTERN.
//VARIABLE TO COUNT POPULARITY OF A PATTERN
var patternTagCounter, popularityCounter=0;

//GET UNORDERED LIST ELEMENT TO ADD ROWS IN IT
var ulContainer = document.querySelector('#passwordList'); 
//VARIABLES REQUIRED TO MAKE A ROW 
var li, ul, dt, dd, splitter, i;

//CATCH THE PATTERN DATA FILE ADDRESS SENT BY PARENT WINDOWS 
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
    document.querySelector('#popularityText').innerHTML = 'Popularity: ' + popularityCounter;
})

/**
 * FUNCTIONALITY FOR CUSTOM WINDOW CONTROLS (CLOSE, MINIMIZE, MAXIMIZE, RESTORE)
 */
function handleWindowControls() {

	let patternDataWin = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.querySelector('#minWindowDiv').addEventListener("click", event => {
        patternDataWin.minimize();
    });

    document.querySelector('#maxWindowDiv').addEventListener("click", event => {
        patternDataWin.maximize();
        document.querySelector('#maxWindowDiv').style.display = 'none';
        document.querySelector('#restoreWindowDiv').style.display = 'block';
    });

    document.querySelector('#restoreWindowDiv').addEventListener("click", event => {
        patternDataWin.unmaximize();
        document.querySelector('#maxWindowDiv').style.display = 'block';
        document.querySelector('#restoreWindowDiv').style.display = 'none';
    });

    document.querySelector('#closeWindowDiv').addEventListener("click", event => {
        patternDataWin.close();
    });

    /**
     * THIS WILL REMOVE ALL LISTENERS ATTACHED TO WINDOW BEFORE APP-
     * GETS CLOSED OR REFRESHED.
     * THIS IS IMPORTANT TO CLEAN LISTENERS AND AVOID WARNINGS.
     */
    window.onbeforeunload = (e) => {
        patternDataWin.removeAllListeners();
    };

    //Recolor window control buttons when focused
    patternDataWin.on('focus', ()=>{
        document.querySelector("#minWindowDiv").style.backgroundColor = '#FFBD44';
        document.querySelector("#maxWindowDiv").style.backgroundColor = '#00CA4E';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = '#00CA4E';
        document.querySelector("#closeWindowDiv").style.backgroundColor = '#FF605C';
    });

    //Grey out window control button when not focused 
    patternDataWin.on('blur', ()=>{
        document.querySelector("#minWindowDiv").style.backgroundColor = '#D3D3D3';
        document.querySelector("#maxWindowDiv").style.backgroundColor = '#D3D3D3';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = '#D3D3D3';
        document.querySelector("#closeWindowDiv").style.backgroundColor = '#D3D3D3';
    });
}

/**
 * PLATFORM WINDOW CONTROL ORDER AND ALIGNMENT WILL BE CHANGED 
 * DYNAMICALLY DEPENDING ON PLATFORM
 */
function platformWindowControl(){

    //If current platform is a mac
    if(process.platform == 'darwin'){
        document.querySelector("#windowControls").classList.add("forMac");
        document.querySelector("#minWindowDiv").style.order = '2';
        document.querySelector("#maxWindowDiv").style.order = '3';
        document.querySelector("#restoreWindowDiv").style.order = '3';
        document.querySelector("#closeWindowDiv").style.order = '1';
    }else{
        //On windows and Linux
        document.querySelector("#windowControls").classList.add("forElse");
    }

    //make controls visible, this is done to avoid default left side alignment jitter 
    document.querySelector("#windowControls").style.visibility = 'visible';
}