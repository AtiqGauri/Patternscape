const appIntroAlert = require('sweetalert2');

/**
 * APP INTRO ALERT'S STRUCTURE
 * APP WILL USE THIS STRUCTURE WITH DIFFERENT CLASSES
 */
function app_intro_alert(cTarget, cTitle, cHtml, cPosition, cClass, cOnOpen, cOnClose){
    appIntroAlert.fire({
        target: document.querySelector('#'+cTarget),
        title: cTitle,
        html: cHtml,
        customClass: cClass,
        position: cPosition,
        background: 'var(--mainTheme-color)',
        toast: true,
        showConfirmButton: true,
        buttonsStyling: false,
        showCancelButton: false,
        stopKeydownPropagation: false,
        allowEscapeKey: false,
        onOpen: () => {
           cOnOpen(); 
        }, 
        onDestroy: () => {
            cOnClose();
        }
    })
}

/**
 * FUNCTION TO CLOSE ANY INTRO ALERT
 */
function stop_app_intro(){
    appIntroAlert.close();
    make_elements_visible();
    decrease_intro_count();
}

/**
 * FUNCTION TO MODIFY INTRO TRIGGER VARIABLE TO ZERO
 */
function never_show_intro(){
    appIntroAlert.close();
    make_elements_visible();
    zero_intro_count();
}

/**
 * CALLBACK FUNCTION TO INITIALIZE NEXT INTRO ALERT IN ROUTE 
 * @param {Function} next_alert NEXT ALERT FUNCTION
 */
function next_intro_alert(next_alert){
    next_alert && next_alert();
}

//STEP 0: ASK IF USER WANT TO SEE APP'S INTRO
function ask_for_intro(){
    app_intro_alert(cTarget='homeTab', cTitle='<p style="color:var(--introAlertMain-text)">Let\'s take a tour of app</p>',
        cHtml='<p class="introHomeText">This will provide a brief intro to main functionalities of the app.</p>'+
        '<div class="neverAskIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="homeIntroSkip" onclick="stop_app_intro()">Skip</div>'+
        '<div class="askIntroNext" onclick="next_intro_alert(home_tab_intro())" style="color:var(--introAlertMain-text)">Next</div></div>', 
        cPosition='center',
        cClass = {
            popup: 'askForIntroAlert',
            confirmButton: 'introConfirmAlert',
            title: 'askIntroTitle',
            },
        cOnOpen = ()=>{
            document.querySelector("#autocomplete").style.visibility = 'hidden';
            document.querySelector("#autocomplete").style.opacity = '0';
            document.querySelector("#navTab").style.pointerEvents = 'none';
            document.querySelector("#navTab").style.visibility = 'hidden';
            document.querySelector("#homeDecor1").style.visibility = 'visible';
            document.querySelector("#homeDecor1").style.opacity = '0.2';
            document.querySelector("#homeDecor2").style.visibility = 'visible';
            document.querySelector("#homeDecor2").style.opacity = '0.2';
        },
        cOnClose = ()=>{
            document.querySelector("#autocomplete").style.visibility = 'visible';
            document.querySelector("#autocomplete").style.opacity = '1';
            document.querySelector("#navTab").style.pointerEvents = 'all';
            document.querySelector("#homeTabButton").style.visibility = 'visible';
            document.querySelector("#homeDecor1").style.visibility = 'visible';
            document.querySelector("#homeDecor1").style.opacity = '1';
            document.querySelector("#homeDecor2").style.visibility = 'visible';
            document.querySelector("#homeDecor2").style.opacity = '1';
        },
    );
}

//STEP 1: INTRODUCE HOME TAB AND TEACH TO SEARCH PATTERN AND ITS DATA
function home_tab_intro(){
    app_intro_alert(cTarget='homeTab', cTitle='<p style="color:var(--homeTab-text)">Home Tab: You can search patterns and their data here</p>',
        cHtml='<p class="introHomeText">First time it could show database is empty. To avoid '+
        'that warning, you can import pattern database or generate database locally in further steps.</p>'+
        '<div class="neverHomeIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="homeIntroSkip" onclick="stop_app_intro()">Skip</div>'+
        '<div class="homeIntroNext" onclick="next_intro_alert(downloaded_database_tab_intro())" style="color:var(--homeTab-text)">Next</div></div>', 
        cPosition='bottom',
        cClass = {
            popup: 'homeIntroAlert',
            confirmButton: 'introConfirmAlert',
            title: 'introTitleAlert',
            },
        cOnOpen = ()=>{
            document.querySelector("#autocomplete").style.pointerEvents = 'none';
            document.querySelector("#navTab").style.transition = "visibility 0ms;"
            document.querySelector("#navTab:not(#homeTabButton)").style.visibility = 'hidden';
            document.querySelector("#homeDecor1").style.visibility = 'hidden';
            document.querySelector("#homeDecor1").style.opacity = '0';
            document.querySelector("#homeDecor2").style.visibility = 'hidden';
            document.querySelector("#homeDecor2").style.opacity = '0';
        },
        cOnClose = ()=>{
            document.querySelector("#autocomplete").style.pointerEvents = 'all';
            document.querySelector("#homeDecor1").style.visibility = 'visible';
            document.querySelector("#homeDecor1").style.opacity = '1';
            document.querySelector("#homeDecor2").style.visibility = 'visible';
            document.querySelector("#homeDecor2").style.opacity = '1';
        },
    );
}


//STEP 2: INTRODUCE DOWNLOADED DATABASE TAB AND TEACH TO IMPORT DOWNLOADED DATABASE
function downloaded_database_tab_intro(){
    app_intro_alert(cTarget='importDownDB', cTitle='',
        cHtml='<p class="introDownDbTitle">Database: Here you can import downloaded database</p>'+
        '<p class="introDownDbText">If you don\'t have any database then download it from <a href=\'#\' style="color:var(--databaseDownload-text)">here</a>'+
        ' and then copy paste that database in above "INPUT FOLDER".</br>'+
        'Once database is imported then you can search pattern on home tab.</p>'+
        '<div class="downDbIntroNever" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="downDbSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="downDbNextIntro" onclick="next_intro_alert(process_analyze_tab_intro())" style="color:var(--databaseDownload-text)">Next</div></div>', 
        cPosition='bottom-start',
        cClass = {
            popup: 'databaseIntroAlert',
            confirmButton: 'introConfirmAlert',
            title: 'introDownDbTitle',
            },
        cOnOpen = ()=>{
            document.querySelector("#impDownDB").click();
            document.querySelector("#databaseTabButton").click();
            document.querySelector("#impDownTextHead").style.color  = 'var(--alertLowVisible-text)';
            document.querySelector("#impDownText").style.color  = 'var(--alertLowVisible-text)';
            document.querySelector("#importDownStop").style.pointerEvents = 'none';
            document.querySelector("#importDownStart").style.pointerEvents = 'none';
            document.querySelector("#homeTabButton").style.visibility = 'hidden';
            document.querySelector("#databaseTabButton").style.visibility = 'visible';
            document.querySelector("#databaseButtons").style.visibility = 'hidden';
            document.querySelector("#impDownDB").style.visibility = 'visible';
            document.querySelector("#databaseLowerBox").style.visibility = 'hidden';
            document.querySelector("#databaseLowerBox").style.opacity = '0';
        },
        cOnClose = ()=>{
            document.querySelector("#impDownTextHead").style.color  = 'var(--databaseDownload-text)';
            document.querySelector("#impDownText").style.color  = 'grey';
            document.querySelector("#importDownStop").style.pointerEvents = 'all';
            document.querySelector("#importDownStart").style.pointerEvents = 'all';
            document.querySelector("#databaseLowerBox").style.visibility = 'visible';
            document.querySelector("#databaseLowerBox").style.opacity = '1';
        },
    );
}

//STEP 3: INTRODUCE ANALYZATION TAB AND TEACH TO PROCESS RAW DATA
function process_analyze_tab_intro(){
    app_intro_alert(cTarget='multiUserTabID', cTitle='<p style="color:var(--processAnalyze-text)">Analyze Tab: Here you can process raw data locally</p>',
        cHtml='<p class="processIntroText">* process raw data to detect patterns in them.</br>'+
        '* required data format => email:password</br>'+
        '* sample input file is already provided.</br>' +
        '* raw data implies to email and password pairs, data files should have plain text in them (txt, csv or no-extension).</br>'+
        '</p>'+
        '<div class="neverProcessIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="processSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="processAnalyzeNextIntro" onclick="next_intro_alert(process_stats_tab_intro())" style="color:var(--processAnalyze-text)">Next</div></div>', 
        cPosition='top-start',
        cClass = {
            popup: 'processIntroAlert',
            header: 'processIntroTitle',
            confirmButton: 'introConfirmAlert',
            },
        cOnOpen = ()=>{
            document.querySelector("#databaseTabButton").style.visibility = 'hidden';
            document.querySelector("#impDownDB").style.visibility = 'hidden';
            document.querySelector("#processTabButton").click();
            document.querySelector("#multipleProcessButton").click();
            document.querySelector("#analyzeStop").style.pointerEvents = 'none';
            document.querySelector("#analyzeStart").style.pointerEvents = 'none';
            document.querySelector("#processTabButton").style.visibility = 'visible';
            document.querySelector("#multipleProcessButton").style.visibility = 'hidden';
            document.querySelector("#multipleProcessButton").style.opacity = '0';
            document.querySelector("#singleUserButton").style.visibility = 'hidden';
            document.querySelector("#singleUserButton").style.opacity = '0';
            document.querySelector("#changeUserTypes").style.visibility = 'hidden';
            document.querySelector("#changeUserTypes").style.opacity = '0';
        },
        cOnClose = ()=>{
            document.querySelector("#analyzeStop").style.pointerEvents = 'all';
            document.querySelector("#analyzeStart").style.pointerEvents = 'all';
            document.querySelector("#singleUserButton").style.pointerEvents = 'all';
            document.querySelector("#changeUserTypes").style.pointerEvents = 'all';
            document.querySelector("#multipleProcessButton").style.visibility = 'visible';
            document.querySelector("#multipleProcessButton").style.opacity = '1';
            document.querySelector("#singleUserButton").style.visibility = 'visible';
            document.querySelector("#singleUserButton").style.opacity = '1';
            document.querySelector("#changeUserTypes").style.visibility = 'visible';
            document.querySelector("#changeUserTypes").style.opacity = '1';
        },
    );
}

//STEP 4: INTRODUCE STATISTICS TAB AND TEACH TO GENERATE STATISTICS
function process_stats_tab_intro(){
    app_intro_alert(cTarget='multiUserTabID', cTitle='<p style="color:var(--processStats-text)">Statistics Tab: Here you can generate stats of detected patterns</p>',
        cHtml='<p class="processIntroText">* previous step detects patterns in raw data, here we can generate stats about processed data.</br>'+
        '* input will be taken automatically from last step, so just press statistics to start it.</br></p>'+
        '<div class="neverProcessIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="processSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="processStatsNextIntro" onclick="next_intro_alert(import_database_tab_intro())" style="color:var(--processStats-text)">Next</div></div>', 
        cPosition='top-start',
        cClass = {
            popup: 'processIntroAlert',
            header: 'processIntroTitle',
            confirmButton: 'introConfirmAlert',
            },
        cOnOpen = ()=>{
            document.querySelector("#processTabButton").click();
            document.querySelector("#multipleProcessButton").click();
            document.querySelector("#statsStart").style.pointerEvents = 'none';
            document.querySelector("#statsStop").style.pointerEvents = 'none';
            document.querySelector("#changeUserTypes").click();
            document.querySelector("#processTabButton").style.visibility = 'visible';
            document.querySelector("#multipleProcessButton").style.visibility = 'hidden';
            document.querySelector("#multipleProcessButton").style.opacity = '0';
            document.querySelector("#singleUserButton").style.visibility = 'hidden';
            document.querySelector("#singleUserButton").style.opacity = '0';
            document.querySelector("#changeUserTypes").style.visibility = 'hidden';
            document.querySelector("#changeUserTypes").style.opacity = '0';
        },
        cOnClose = ()=>{
            document.querySelector("#singleUserButton").style.pointerEvents = 'all';
            document.querySelector("#changeUserTypes").style.pointerEvents = 'all';
            document.querySelector("#statsStart").style.pointerEvents = 'all';
            document.querySelector("#statsStop").style.pointerEvents = 'all';
            document.querySelector("#multipleProcessButton").style.visibility = 'visible';
            document.querySelector("#multipleProcessButton").style.opacity = '1';
            document.querySelector("#singleUserButton").style.visibility = 'visible';
            document.querySelector("#singleUserButton").style.opacity = '1';
            document.querySelector("#changeUserTypes").style.visibility = 'visible';
            document.querySelector("#changeUserTypes").style.opacity = '1';
        },
    );
}


//STEP 5: TEACH TO IMPORT LOCALLY GENERATED PATTERN IN DATABASE
function import_database_tab_intro(){
    app_intro_alert(cTarget='importDB', cTitle='',
        cHtml='<p class="introDownDbTitle" style="color:var(--databaseImport-text)">Database: Here you can import downloaded database</p>'+
        '<p class="introDownDbText">The stats generated in previous step can be imported here, you can check input in "DATABASE INPUT FOLDER".&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;&emsp;'+
        'Once database is imported, then you will be able to search locally processed pattern from home tab.</p>'+
        '<div class="downDbIntroNever" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="downDbSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="dbImportNextIntro" onclick="intro_is_completed()" style="color:var(--databaseImport-text)">Next</div></div>', 
        cPosition='bottom-start',
        cClass = {
            popup: 'databaseImportIntro',
            confirmButton: 'introConfirmAlert',
            title: 'introDownDbTitle',
            },
        cOnOpen = ()=>{
            document.querySelector("#processTabButton").style.visibility = 'hidden';
            document.querySelector("#databaseTabButton").click();
            document.querySelector("#impDB").click();
            document.querySelector("#impDataHeading").style.color  = 'var(--alertLowVisible-text)';
            document.querySelector("#impDataText").style.color  = 'var(--alertLowVisible-text)';
            document.querySelector("#importDbStart").style.pointerEvents = 'none';
            document.querySelector("#importDbStop").style.pointerEvents = 'none';
            document.querySelector("#navTab").style.visibility = 'hidden';
            document.querySelector("#databaseTabButton").style.visibility = 'visible';
            document.querySelector("#databaseButtons").style.visibility = 'hidden';
            document.querySelector("#impDB").style.visibility = 'visible';

            document.querySelector("#databaseLowerBox").style.visibility = 'hidden';
            document.querySelector("#databaseLowerBox").style.opacity = '0';
        },
        cOnClose = ()=>{
            document.querySelector("#importDbStart").style.pointerEvents = 'all';
            document.querySelector("#importDbStop").style.pointerEvents = 'all';
            document.querySelector("#impDataHeading").style.color  = 'var(--databaseImport-text)';
            document.querySelector("#impDataText").style.color  = 'grey';
            document.querySelector("#processTabButton").style.visibility = 'visible';
            document.querySelector("#homeTabButton").style.visibility = 'visible';
            document.querySelector("#navTab").style.visibility = 'visible';
            document.querySelector("#databaseButtons").style.visibility = 'visible';
            document.querySelector("#databaseLowerBox").style.visibility = 'visible';
            document.querySelector("#impDownDB").style.visibility = 'visible';
            document.querySelector("#databaseLowerBox").style.opacity = '1';
            document.querySelector("#homeTabButton").click();
        },
    );
}

//STEP 6: ACKNOWLEDGMENT OF INTRO COMPLETION
function intro_is_completed(){
    app_intro_alert(cTarget='homeTab', cTitle='<p style="color:var(--introAlertMain-text)">Theme can be changed from top right button</p>',
        cHtml='<p class="introHomeText">You can choose between dark and light theme and your preference will be saved in local database.</p>'+
        '<div class="completedIntroSkip" onclick="never_show_intro()" style="color:var(--introAlertMain-text)">DONE</div>', 
        cPosition='center',
        cClass = {
            popup: 'askForIntroAlert',
            confirmButton: 'introConfirmAlert',
            title: 'askIntroTitle',
            content: 'completedIntroContent'
            },
        cOnOpen = ()=>{            
            document.querySelector("#navTab").style.pointerEvents = 'none';
            document.querySelector("#navTab").style.visibility = 'hidden';
            document.querySelector("#targetTabButton").style.visibility = 'hidden';
            document.querySelector("#processTabButton").style.visibility = 'hidden';
            document.querySelector("#databaseTabButton").style.visibility = 'hidden';
            document.querySelector("#documentsTabButton").style.visibility = 'hidden';
            document.querySelector("#homeDecor1").style.opacity = '0.2';
            document.querySelector("#homeDecor2").style.opacity = '0.2';
        },
        cOnClose = ()=>{
            document.querySelector("#navTab").style.pointerEvents = 'all';
            document.querySelector("#navTab").style.visibility = 'visible';
            document.querySelector("#targetTabButton").style.visibility = 'visible';
            document.querySelector("#processTabButton").style.visibility = 'visible';
            document.querySelector("#databaseTabButton").style.visibility = 'visible';
            document.querySelector("#documentsTabButton").style.visibility = 'visible';
            document.querySelector("#homeDecor1").style.opacity = '1';
            document.querySelector("#homeDecor2").style.opacity = '1';
        },
    );
}

function make_elements_visible(){
    document.querySelector("#autocomplete").style.visibility = 'visible';
    document.querySelector("#autocomplete").style.opacity = '1';
    document.querySelector("#autocomplete").style.pointerEvents = 'all';
    document.querySelector("#navTab").style.pointerEvents = 'all';
    document.querySelector("#navTab").style.visibility = 'visible';
    document.querySelector("#homeTabButton").style.visibility = 'visible';
    document.querySelector("#homeDecor1").style.visibility = 'visible';
    document.querySelector("#homeDecor1").style.opacity = '1';
    document.querySelector("#homeDecor2").style.visibility = 'visible';
    document.querySelector("#homeDecor2").style.opacity = '1';
    document.querySelector("#databaseButtons").style.visibility = 'visible';
    document.querySelector("#databaseTabButton").style.visibility = 'visible';
}

/**
 * DECREASE INTRO TRIGGER VARIABLE BY ONE
 * THIS WILL MODIFY DATABASE VARIABLE (showAppIntro)
 */
async function decrease_intro_count(){
    database.transaction('rw', database.UserData, async ()=> {
        try {
            await database.UserData.where("key").equals("showAppIntro").each(async (result) => {
                await database.UserData.where("key").equals("showAppIntro").modify({"value": (result.value - 1)});
            });  
        } catch (err) {
            console.log(err);
        }
    });
}

/**
 * SET INTRO TRIGGER VARIABLE TO ZERO
 * THIS WILL MODIFY INTRO VARIABLE (showAppIntro)
 */
async function zero_intro_count(){
    await database.UserData.where("key").equals("showAppIntro").modify({"value": 0});
}