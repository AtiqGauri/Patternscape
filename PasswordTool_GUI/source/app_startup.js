//#############################################
//  THIS FILE IS NOT SET AS PRELOAD IN MAIN.JS 
//#############################################

const { remote } = require('electron')
const { Menu, MenuItem, getCurrentWindow } = remote

// When document has loaded, initialized
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handle_window_controls();
    }
};

/**
 * FUNCTIONALITY FOR CUSTOM WINDOW CONTROLS (CLOSE, MINIMIZE, MAXIMIZE, RESTORE)
 */
function handle_window_controls() {
	let win = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.querySelector('#minWindowDiv').addEventListener("click", event => {
        win.minimize();
    });
    document.querySelector('#maxWindowDiv').addEventListener("click", event => {
        win.maximize();
        document.querySelector('#maxWindowDiv').style.display = 'none';
        document.querySelector('#restoreWindowDiv').style.display = 'block';
    });
    document.querySelector('#restoreWindowDiv').addEventListener("click", event => {
        win.unmaximize();
        document.querySelector('#maxWindowDiv').style.display = 'block';
        document.querySelector('#restoreWindowDiv').style.display = 'none';
    });
    document.querySelector('#closeWindowDiv').addEventListener("click", event => {
        win.close();
    });

    /**
     * THIS WILL REMOVE ALL LISTENERS ATTACHED TO WINDOW BEFORE APP-
     * GETS CLOSED OR REFRESHED.
     * THIS IS IMPORTANT TO CLEAN LISTENERS AND AVOID WARNINGS.
     */
    window.onbeforeunload = (e) => {
        win.removeAllListeners();
    };

    //CATCH UNHANDLED CRASHES
    win.webContents.on('crashed', (event) => {
        console.error('Renderer error: ' +err);
        win.reload();
    });

    //Recolor window control buttons when focused
    win.on('focus', ()=>{
        document.querySelector("#minWindowDiv").style.backgroundColor = 'var(--windowMinimize-yellow)';
        document.querySelector("#maxWindowDiv").style.backgroundColor = 'var(--windowResize-green)';
        document.querySelector("#restoreWindowDiv").style.backgroundColor = 'var(--windowResize-green)';
        document.querySelector("#closeWindowDiv").style.backgroundColor = 'var(--windowClose-red)';
    });

    //Grey out window control button when not focused 
    win.on('blur', ()=>{
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
function platform_window_control(){

    //If current platform is a mac
    if(process.platform == 'darwin'){
        document.querySelector("#windowControls").classList.add("forMac");
        document.querySelector("#minWindowDiv").style.order = '2';
        document.querySelector("#maxWindowDiv").style.order = '3';
        document.querySelector("#restoreWindowDiv").style.order = '3';
        document.querySelector("#closeWindowDiv").style.order = '1';
    
    //On windows and Linux
    }else{
        document.querySelector("#windowControls").classList.add("forElse");
    }

    //make controls visible, this is done to avoid default left side alignment jitter 
    document.querySelector("#windowControls").style.visibility = 'visible';
}
platform_window_control();


/**
 * CUSTOM RIGHT CLICK MENU
 */
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


/**
 * THIS FUNCTION WILL HANDLE ALL THE EVENTS WHICH WILL EXECUTE-
 * ON FEW STARTING OPENINGS OF APP.
 * 1. SPLASH SCREEN (SPLASHED LONGER FOR THE FIRST TIME)
 * 2. HOW MANY TIMES APP INTRO SHOULD BE TRIGGERED 
 */
async function oneTimeEventsOfApp(){
    await database.UserData.where("key").anyOf("firstSplashScreen", "showAppIntro").each(function (result) {
        switch(result.key) {
            
            //To change first splash time go to "APP_FOLDER/source/scripts/databaseInit.js"
            //and change UserPreference => firstSplashScreen.value
            case "firstSplashScreen":
                setTimeout(async () => {
                    document.querySelector("#splashScreen").style.opacity = '0';
                    document.querySelector("#splashScreen").style.visibility = '0';
                    document.querySelector("#mainScreen").style.opacity = '1';
                    document.querySelector("#mainScreen").style.visibility = 'visible';
                    //update splash time to 1ms to avoid long splash screens
                    await database.UserData.where("key").equals("firstSplashScreen").modify({"value": 1});
                }, result.value);
              break;
            
            //To change total intro triggers go to "APP_FOLDER/source/scripts/databaseInit.js"
            //and change UserPreference => showAppIntro.value
            case "showAppIntro":
                if(result.value >= 1){   
                    //App intro route >>APP_FOLDER/source/scripts/appIntro.js<< 
                    ask_for_intro();
                }
              break;

            default:
                console.log("User data is not available");
        }
    });
}