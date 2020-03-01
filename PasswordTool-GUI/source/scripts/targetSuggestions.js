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

	let win = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.getElementById('minWindowDiv').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('maxWindowDiv').addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('restoreWindowDiv').addEventListener("click", event => {
        win.unmaximize();
    });

    document.getElementById('closeWindowDiv').addEventListener("click", event => {
        win.close();
    });

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
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
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);
}


function platformWindowControl(){
    if(process.platform == 'darwin'){
        document.getElementById("windowControls").classList.add("forMac");
    }else{
        document.getElementById("windowControls").classList.add("forElse");
    }
}