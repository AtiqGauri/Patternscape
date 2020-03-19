//TO COMMUNICATE WITH PARENT WINDOW
const ipc = require('electron').ipcRenderer; 

// WHEN DOCUMENT HAS LOADED, INITIALIZED
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};

//GET ORDERED LIST ELEMENT TO APPEND SUGGESTION ROWS INTO IT
var olContainer = document.querySelector('#suggestionList'), li;

//CATCH SUGGESTION ARRAY SENT BY PARENT WINDOW
ipc.on('message', (event, suggestionArray) => {

    //if ipc renderer doesn't sent any data in object
    if(Object.keys(suggestionArray).length === 0){
        //tell user there is no data to display
        error_no_data_received();
        console.error('No data received from ipcRenderer');
        return;
    }

    //iterate over suggestion array
    suggestionArray.forEach(function (suggestion) {

        //create a list element
        li = document.createElement('li');
        //append list element to main suggestions list
        olContainer.appendChild(li);       
        
        //create a dt element, this will represent suggested pattern
        dt = document.createElement('dt');
        dt.innerHTML = suggestion.original;
        //append it to current row(list element)
        li.appendChild(dt);

        //create a dd element, this will represent processed pattern
        dd = document.createElement('dd');
        dd.innerHTML = suggestion.generated;
        //append it to current row(list element)
        li.appendChild(dd);

    });

})

/**
 * FUNCTIONALITY FOR CUSTOM WINDOW CONTROLS (CLOSE, MINIMIZE, MAXIMIZE, RESTORE)
 */
function handleWindowControls() {

	let suggestionWin = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.querySelector('#minWindowDiv').addEventListener("click", event => {
        suggestionWin.minimize();
    });

    document.querySelector('#maxWindowDiv').addEventListener("click", event => {
        suggestionWin.maximize();
        document.querySelector('#maxWindowDiv').style.display = 'none';
		document.querySelector('#restoreWindowDiv').style.display = 'block';
    });

    document.querySelector('#restoreWindowDiv').addEventListener("click", event => {
        suggestionWin.unmaximize();
        document.querySelector('#maxWindowDiv').style.display = 'block';
		document.querySelector('#restoreWindowDiv').style.display = 'none';
    });

    document.querySelector('#closeWindowDiv').addEventListener("click", event => {
        suggestionWin.close();
    });

    /**
     * THIS WILL REMOVE ALL LISTENERS ATTACHED TO WINDOW BEFORE APP-
     * GETS CLOSED OR REFRESHED.
     * THIS IS IMPORTANT TO CLEAN LISTENERS AND AVOID WARNINGS.
     */
    window.onbeforeunload = (e) => {
        suggestionWin.removeAllListeners();
    };
    //Recolor window control buttons when focused
    suggestionWin.on('focus', ()=>{
        document.querySelector("#minWindowDiv").style.backgroundColor = '#FFBD44';
        document.querySelector("#maxWindowDiv").style.backgroundColor = '#00CA4E';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = '#00CA4E';
        document.querySelector("#closeWindowDiv").style.backgroundColor = '#FF605C';
    });
    //Grey out window control button when not focused 
    suggestionWin.on('blur', ()=>{
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
    document.querySelector('#suggestionList').style.display = 'none';
    
    //display svg saying no data received
    swingingGirl = document.querySelector('#noDataReceived');
    swingingGirl.style.display = 'block';
    swingingGirl.src = '../assets/images/No_data_received.svg';
    swingingGirl.style.height = '79vh';
    swingingGirl.style.width = 'auto';
    swingingGirl.style.marginLeft = '26vw';
    swingingGirl.style.marginTop = '6vw';
}