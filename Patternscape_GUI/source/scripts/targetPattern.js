//TO COMMUNICATE WITH PARENT WINDOW
//CONST REQUIRE = PARENT.REQUIRE;
const ipc = require('electron').ipcRenderer;

// WHEN DOCUMENT HAS LOADED, INITIALIZED
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};

//SET WINDOW THEME BASED ON APP THEME
if(window.localStorage.user_theme == 'dark'){
    document.querySelector("#targetPatternHtml").setAttribute("data-theme", "dark");
    console.log("child theme should be: " + window.localStorage.user_theme);  
}


//REQUIRE H1 ELEMENT TO REFLECT PASSWORD 
var h1 = document.querySelector('#passwordString');
//REQUIRE ORDERED LIST TO ADD PATTERN ROWS
var olContainer = document.querySelector('#generatedPatterns');
//REQUIRED VARIABLES
var li, ul, dt, dd, patternTagCounter, i, j, splitter;

//CATCH DETECTED PATTERN IN PASSED PASSWORD
ipc.on('message', (event, data) => {

    //look at data in console to understand while loop working
    console.log(data);
    
    //if ipc renderer doesn't sent any data in object
    if(data.toString()==''){
        //tell user there is no data to display
        error_no_data_received();
        console.error('No data received from ipcRenderer');
        return;
    }

    //split data into tokens
    splitter = data.toString().split('<|>');
    
    //initialize while loop to iterate over data
    i=0;
    //-1 to escape last empty token in splitter
    while(i<(splitter.length-1)){
        
        //create list for next pattern and its data
        li = document.createElement('li');
        //reflect current pattern as a list element
        li.innerHTML = 'Pattern: ' + splitter[i];
        //count number slash in pattern to get number of value that pattern has
        patternTagCounter = (splitter[i].match(/\//g)).length;
        //increase i to password
        i++;

        //reflect password
        h1.innerHTML = 'Password: ' + splitter[i];
        
        //append current pattern as list element to main ordered list
        olContainer.appendChild(li);

        //increase i to first value of current pattern
        i++;

        //create a ul element to contain all values and data of current pattern as its child
        ul = document.createElement('ul');
        li.appendChild(ul);
        
        //loop to iterate over all value of current pattern
        for(j=0; j<patternTagCounter; j++){
            //create dt element to reflect values of current pattern
            dt = document.createElement('dt');
            //reflect dt value
            dt.innerHTML = splitter[i];
            ul.appendChild(dt);
            //increase i to data associated with above value
            i++;

            //create dd element to reflect data associated with value
            dd = document.createElement('dd');
            //reflect dd data
            dd.innerHTML = splitter[i];
            ul.appendChild(dd);
            //increase i to next value of current pattern
            i++;
        }
        //next pattern
    }


})

/**
 * FUNCTIONALITY FOR CUSTOM WINDOW CONTROLS (CLOSE, MINIMIZE, MAXIMIZE, RESTORE)
 */
function handleWindowControls() {

	let targetWin = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.querySelector('#minWindowDiv').addEventListener("click", event => {
        targetWin.minimize();
    });

    document.querySelector('#maxWindowDiv').addEventListener("click", event => {
        targetWin.maximize();
        document.querySelector('#maxWindowDiv').style.display = 'none';
		document.querySelector('#restoreWindowDiv').style.display = 'block';
    });

    document.querySelector('#restoreWindowDiv').addEventListener("click", event => {
        targetWin.unmaximize();
        document.querySelector('#maxWindowDiv').style.display = 'block';
		document.querySelector('#restoreWindowDiv').style.display = 'none';
    });

    document.querySelector('#closeWindowDiv').addEventListener("click", event => {
        targetWin.close();
    });

    /**
     * THIS WILL REMOVE ALL LISTENERS ATTACHED TO WINDOW BEFORE APP-
     * GETS CLOSED OR REFRESHED.
     * THIS IS IMPORTANT TO CLEAN LISTENERS AND AVOID WARNINGS.
     */
    window.onbeforeunload = (e) => {
        targetWin.removeAllListeners();
    };
    //Recolor window control buttons when focused
    targetWin.on('focus', ()=>{
        document.querySelector("#minWindowDiv").style.backgroundColor = 'var(--windowMinimize-yellow)';
        document.querySelector("#maxWindowDiv").style.backgroundColor = 'var(--windowResize-green)';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = 'var(--windowResize-green)';
        document.querySelector("#closeWindowDiv").style.backgroundColor = 'var(--windowClose-red)';
    });
    //Grey out window control button when not focused
    targetWin.on('blur', ()=>{
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
    document.querySelector('#generatedPatterns').style.display = 'none';
    document.querySelector('#passwordString').style.color = 'var(--light-grey)';
    
    //display svg saying no data received
    swingingGirl = document.querySelector('#noDataReceived');
    swingingGirl.style.display = 'block';
    swingingGirl.src = '../assets/images/No_data_received.svg';
    swingingGirl.style.height = '79vh';
    swingingGirl.style.width = 'auto';
    swingingGirl.style.marginLeft = '26vw';
}