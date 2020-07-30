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

//SET WINDOW THEME BASED ON APP THEME
if(window.localStorage.user_theme == 'dark'){
    document.querySelector("#patterCategoryHtml").setAttribute("data-theme", "dark");
    console.log("child theme should be: ");  
}

//INITIALIZE N-READLINES WITH DATA FILE ADDRESS
//DOUBLE IF STATEMENT TO AVOID PATH ERROR BECAUSE OF ASAR PACKAGING OF ELECTRON APP
if(fs.existsSync(path.join(__dirname, '..', '..', '..', '..','data', 'Stats', 'Patterns.txt'))){   
    var liner = new lineByLine(path.join(__dirname, '..', '..', '..', '..','data', 'Stats', 'Patterns.txt'));
}else if(fs.existsSync(path.join(__dirname, '..', '..','data', 'Stats', 'Patterns.txt'))){
    var liner = new lineByLine(path.join(__dirname, '..', '..','data', 'Stats', 'Patterns.txt'));
}else{
    console.error('data/Stats/Pattern.txt file doesn\'t exist');
    //tell user there is no data to display
    error_no_data_received();
}


//VARIABLE TO DENOTE SINGLE LINE STRING
let line;
//SPLITTER WILL BE USED TO SPLIT STRING IN TOKENS
var splitter;
//NUMBER OF ROWS COUNTER
var maxLines = 0;

//GET TABLE ELEMENT TO ADD ROWS IN IT
var table = document.querySelector('#patternTable'), tr;

//LOOP TO ITERATE IN A FILE
while(line = liner.next()){
    if(maxLines < 100){
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
        pattern.style.color = 'var(--patternCategory-pattern)';
        //enter popularity data
        popularity.innerHTML = splitter[2];
        popularity.style.color = 'var(--patternCategory-popularity)';
        //enter address data
        address.innerHTML = splitter[1];
        address.style.color = 'var(--patternCategory-address)';

        //append row into table element
        table.appendChild(tr);
    }
    maxLines++;
}

if(maxLines == 0){
    //tell user there is no data to display
    error_no_data_received();
}else{
    /**
     * FOOTER WITH ENDING MESSAGE
     * EXECUTES ONCE SPECIFIED NUMBER OF PATTERNS ARE ADDED 
     */
    //add last row 
    tr = document.createElement('tr');
    tr.style.whiteSpace = 'nowrap';
    tr.style.height = '20vh';
    tr.style.textAlign = 'center';
    tr.style.color = '#FF605C';
    //add message div in that row
    endRowDiv = document.createElement('div');
    endRowDiv.innerHTML = 'Total number of generated stats: '+ maxLines+
                            '</br> Import these patterns to access them in home tab';
    document.querySelector('#header').innerHTML += maxLines;
    endRowDiv.style.position = 'relative';
    endRowDiv.style.top = '8vh';
    endRowDiv.style.width = '98vw';
    endRowDiv.style.textAlign = 'center';
    endRowDiv.style.userSelect = 'none';
    tr.appendChild(endRowDiv);
    table.appendChild(tr);
    maxLines = 0;
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
        document.querySelector("#minWindowDiv").style.backgroundColor = 'var(--windowMinimize-yellow)';
        document.querySelector("#maxWindowDiv").style.backgroundColor = 'var(--windowResize-green)';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = 'var(--windowResize-green)';
        document.querySelector("#closeWindowDiv").style.backgroundColor = 'var(--windowClose-red)';
    });

    //Grey out window control button when not focused
    patternCategoryWin.on('blur', ()=>{
        document.querySelector("#minWindowDiv").style.backgroundColor = 'var(--windowsControls-unfocused)';
        document.querySelector("#maxWindowDiv").style.backgroundColor = 'var(--windowsControls-unfocused)';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = 'var(--windowsControls-unfocused)';
        document.querySelector("#closeWindowDiv").style.backgroundColor = 'var(--windowsControls-unfocused)';
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

/**
 * Function to display error message saying no data is received
 * This will load svg with inbuilt css for animation
 * To change color or animation, head toward svg source file 
 */
function error_no_data_received(){
    //remove and blur empty containers
    document.querySelector('body').style.backgroundColor = 'grey';
    document.querySelector('html').style.backgroundColor = 'grey';
    document.querySelector('#titleBar').style.backgroundColor = 'grey';
    document.querySelector('#patternTable').style.display = 'none';
    document.querySelector('#header').style.opacity = '0';
    
    //display svg saying no data received
    swingingGirl = document.querySelector('#noDataReceived');
    swingingGirl.style.display = 'block';
    swingingGirl.src = '../assets/images/No_data_received.svg';
    swingingGirl.style.height = '79vh';
    swingingGirl.style.width = 'auto';
    swingingGirl.style.marginLeft = '26vw';
}