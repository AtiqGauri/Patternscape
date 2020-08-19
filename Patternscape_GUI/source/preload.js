const { remote } = require('electron');

//dark mode
const nativeTheme = remote.nativeTheme;

//CHECK USER PREFERENCE FOR THEME IN LOCAL-STORAGE DATABASE 
window.localStorage.os_dark_mode = nativeTheme.shouldUseDarkColors;   

//IF THIS IS FIRST TIME APP LAUNCH THEN SET THEME AS SYSTEM DEFAULT
if(window.localStorage.os_dark_mode == 'true' && window.localStorage.user_theme == null){
   window.localStorage.user_theme = 'dark';
   console.log("Theme has been set as system default: " + window.localStorage.user_theme);
   nativeTheme.themeSource = window.localStorage.user_theme;
}else if(window.localStorage.os_dark_mode == 'false' && window.localStorage.user_theme == null){
    window.localStorage.user_theme = 'light';
    console.log("Theme has been set as system default: " + window.localStorage.user_theme);
    nativeTheme.themeSource = window.localStorage.user_theme;

    //ELSE CHANGE IT TO USER PREFERENCE
}else{
    nativeTheme.themeSource = window.localStorage.user_theme;
}