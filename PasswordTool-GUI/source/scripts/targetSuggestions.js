//to communicate with parent window
const ipc = require('electron').ipcRenderer; 

// When document has loaded, initialized
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};

//get ordered list element to append suggestion rows into it
var olContainer = document.getElementById('suggestionList'), li;

//Catch suggestion array sent by parent window
ipc.on('message', (event, suggestionArray) => {

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

function handleWindowControls() {

	let suggestionWin = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.getElementById('minWindowDiv').addEventListener("click", event => {
        suggestionWin.minimize();
    });

    document.getElementById('maxWindowDiv').addEventListener("click", event => {
        suggestionWin.maximize();
    });

    document.getElementById('restoreWindowDiv').addEventListener("click", event => {
        suggestionWin.unmaximize();
    });

    document.getElementById('closeWindowDiv').addEventListener("click", event => {
        suggestionWin.close();
    });

    function toggleMaxRestoreButtons() {
        if (suggestionWin.isMaximized()) {
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
    suggestionWin.on('maximize', toggleMaxRestoreButtons);
    suggestionWin.on('unmaximize', toggleMaxRestoreButtons);
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