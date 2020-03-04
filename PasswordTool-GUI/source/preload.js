// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
const { remote } = require('electron')
const { Menu, MenuItem, getCurrentWindow } = remote


platformWindowControl();

// When document has loaded, initialized
document.onreadystatechange = () => {
    
    if (document.readyState == "complete") {
        handleWindowControls();
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



const menu = new Menu()
menu.append(new MenuItem({ label: 'Cut', role:'cut' }))
menu.append(new MenuItem({ label: 'Copy', role:'copy' }))
menu.append(new MenuItem({ label: 'Paste', role:'paste' }))
menu.append(new MenuItem({ type: 'separator' }))
menu.append(new MenuItem({ label: 'Refresh', click() { getCurrentWindow().reload() } }))
//menu.append(new MenuItem({ type: 'separator' }))
//console.log(process.env);
menu.append(new MenuItem({ label: 'Inspect Element', click() { getCurrentWindow().webContents.openDevTools({mode: 'detach'}) } }))

window.addEventListener('contextmenu', (e) => {
  e.preventDefault()
  menu.popup({ window: remote.getCurrentWindow() })
}, false)



async function oneTimeEventsOfApp(){
    var splashTime=0;
    await database.UserData.where("key").anyOf("firstSplashScreen", "showAppIntro").each(function (result) {
        switch(result.key) {
            case "firstSplashScreen":
                result.value == 'true' ? splashTime=2000 : splashTime=0;
                setTimeout(async () => {
                    document.getElementById("splashScreen").style.opacity = '0';
                    document.getElementById("splashScreen").style.visibility = '0';
                    document.getElementById("mainScreen").style.opacity = '1';
                    document.getElementById("mainScreen").style.visibility = 'visible';
                    await database.UserData.where("key").equals("firstSplashScreen").modify({"value": "false"});
                }, splashTime);
              break;

            case "showAppIntro":
                console.log("showAppIntro " + result.value);
              break;

            default:
                console.log("default");
        }
    });
}