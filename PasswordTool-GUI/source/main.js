// MODULES TO CONTROL APPLICATION LIFE AND CREATE NATIVE BROWSER WINDOW
const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')

// KEEP A GLOBAL REFERENCE OF THE WINDOW OBJECT, IF YOU DON'T, THE WINDOW WILL
// BE CLOSED AUTOMATICALLY WHEN THE JAVASCRIPT OBJECT IS GARBAGE COLLECTED.

let mainWindow

function createWindow () {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280, height: 720,
    minWidth: 1280, minHeight:720,
    title: "PasswordTool",
    icon: 'source/asset/icons/app-icon.png',
    autoHideMenuBar: true,
    frame: false,
    backgroundColor: '#F2F2F2',
    show: false,
    webPreferences: {
      nativeWindowOpen: true,
      nodeIntegration: true,
      nodeIntegrationInWorker: true,
      webviewTag: true,
      //webSecurity: false,
      //contextIsolation: false,
      //allowRunningInsecureContent: true,
      //experimentalFeatures: true,
      //enableBlinkFeatures: ['ExecCommandInJavaScript'],
      //enableRemoteModule: true,
    }
  })

  mainWindow.maximize();

  // and load the index.html of the app.
  mainWindow.loadFile('source/index.html')

  // Open the DevTools.
  //mainWindow.webContents.openDevTools()
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// THIS METHOD WILL BE CALLED WHEN ELECTRON HAS FINISHED
// INITIALIZATION AND IS READY TO CREATE BROWSER WINDOWS.
// SOME APIS CAN ONLY BE USED AFTER THIS EVENT OCCURS.
app.on('ready', createWindow)

// QUIT WHEN ALL WINDOWS ARE CLOSED.
app.on('window-all-closed', function () {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') app.quit()
})

app.on('activate', function () {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) createWindow()
})

// IN THIS FILE YOU CAN INCLUDE THE REST OF YOUR APP'S SPECIFIC MAIN PROCESS
// CODE. YOU CAN ALSO PUT THEM IN SEPARATE FILES AND REQUIRE THEM HERE.