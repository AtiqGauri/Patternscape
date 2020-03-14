//REQUIRE PATH PACKAGE TO HANDLE FILE ADDRESSES
const path = require('path');
//REQUIRE FILE SYSTEM
const fs = require('fs');
//REQUIRE N-READLINES TO READ HUGE FILE LINE BY LINE WITHOUT EXCESSIVE USE OF MEMORY 
const lineByLine = require('n-readlines');

// WHEN DOCUMENT HAS LOADED, INITIALIZED
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};


//INITIALIZE N-READLINES WITH DATA FILE ADDRESS
//DOUBLE IF STATEMENT TO AVOID PATH ERROR BECAUSE OF ASAR PACKAGING OF ELECTRON APP
if(fs.existsSync(path.join(__dirname, '..', '..', '..', '..','data', 'Stats', 'Patterns.txt'))){   
    var liner = new lineByLine(path.join(__dirname, '..', '..', '..', '..','data', 'Stats', 'Patterns.txt'));
}else if(fs.existsSync(path.join(__dirname, '..', '..','data', 'Stats', 'Patterns.txt'))){
    var liner = new lineByLine(path.join(__dirname, '..', '..','data', 'Stats', 'Patterns.txt'));
}else{
    console.error('data/Stats/Pattern.txt file doesn\'t exist');
}


//VARIABLE TO DENOTE SINGLE LINE STRING
let line;
//SPLITTER WILL BE USED TO SPLIT STRING IN TOKENS
var splitter;

//GET TABLE ELEMENT TO ADD ROWS IN IT
var table = document.querySelector('#patternTable'), tr;

//LOOP TO ITERATE IN A FILE
while(line = liner.next()){

    //get table row element
    tr = document.createElement('tr');

    //split lines into tokens
    splitter = line.toString().split('<|>');

    //create a pattern cell
    pattern = document.createElement('td');
    //create a popularity cell
    popularity = document.createElement('td');
    //create a address cell
    address = document.createElement('td');
    
    //append pattern cell into row
    tr.appendChild(pattern);
    //append popularity cell into row
    tr.appendChild(popularity);
    //append address cell into row
    tr.appendChild(address);

    //enter pattern data
    pattern.innerHTML = splitter[0];
    pattern.style.color = '#B94955';
    //enter popularity data
    popularity.innerHTML = splitter[2];
    popularity.style.color = '#5A81AE';
    //enter address data
    address.innerHTML = splitter[1];
    address.style.color = '#f9a825';
    
    //append row into table element
    table.appendChild(tr);
}

/**
 * FUNCTIONALITY FOR CUSTOM WINDOW CONTROLS (CLOSE, MINIMIZE, MAXIMIZE, RESTORE)
 */
function handleWindowControls() {

	let patternCategoryWin = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.querySelector('#minWindowDiv').addEventListener("click", event => {
        patternCategoryWin.minimize();
    });

    document.querySelector('#maxWindowDiv').addEventListener("click", event => {
        patternCategoryWin.maximize();
        document.querySelector('#maxWindowDiv').style.display = 'none';
		document.querySelector('#restoreWindowDiv').style.display = 'block';
    });

    document.querySelector('#restoreWindowDiv').addEventListener("click", event => {
        patternCategoryWin.unmaximize();
        document.querySelector('#maxWindowDiv').style.display = 'block';
        document.querySelector('#restoreWindowDiv').style.display = 'none';
    });

    document.querySelector('#closeWindowDiv').addEventListener("click", event => {
        patternCategoryWin.close();
    });

    /**
     * THIS WILL REMOVE ALL LISTENERS ATTACHED TO WINDOW BEFORE APP-
     * GETS CLOSED OR REFRESHED.
     * THIS IS IMPORTANT TO CLEAN LISTENERS AND AVOID WARNINGS.
     */
    window.onbeforeunload = (e) => {
        patternCategoryWin.removeAllListeners();
    };

    //Recolor window control buttons when focused
    patternCategoryWin.on('focus', ()=>{
        document.querySelector("#minWindowDiv").style.backgroundColor = '#FFBD44';
        document.querySelector("#maxWindowDiv").style.backgroundColor = '#00CA4E';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = '#00CA4E';
        document.querySelector("#closeWindowDiv").style.backgroundColor = '#FF605C';
    });

    //Grey out window control button when not focused
    patternCategoryWin.on('blur', ()=>{
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