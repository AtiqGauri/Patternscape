// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.

// When document has loaded, initialized
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};

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

    // Toggle maximize/restore buttons when maximization/unmaximization occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);

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
}


function platformWindowControl(){
    if(process.platform == 'darwin'){
        document.getElementById("windowControls").classList.add("forMac");
    }else{
        document.getElementById("windowControls").classList.add("forElse");
    }
}