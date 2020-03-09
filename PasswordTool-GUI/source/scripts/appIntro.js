const appIntroAlert = require('sweetalert2');

function app_intro_alert(cTarget, cTitle, cHtml, cPosition, cClass, cOnOpen, cOnClose){
    appIntroAlert.fire({
        target: document.getElementById(cTarget),
        title: cTitle,
        html: cHtml,
        customClass: cClass,
        position: cPosition,
        background: '#F2F2F2',
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

function stop_app_intro(){
    appIntroAlert.close();
    make_elements_visible();
    decrease_intro_count();
}

function never_show_intro(){
    appIntroAlert.close();
    make_elements_visible();
    zero_intro_count();
}

function next_intro_alert(next_alert){
    next_alert && next_alert();
}

//STEP 0: Teach to search pattern and its data
function ask_for_intro(){
    app_intro_alert(cTarget='homeTab', cTitle='<p style="color:#f9a825">Let\'s take a tour of app</p>',
        cHtml='<p class="introHomeText">This will provide a brief intro to main functionalities of the app.</p>'+
        '<div class="neverAskIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="homeIntroSkip" onclick="stop_app_intro()">Skip</div>'+
        '<div class="homeIntroNext" onclick="next_intro_alert(home_tab_intro())" style="color:#f9a825">Next</div></div>', 
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

//STEP 1: Teach to search pattern and its data
function home_tab_intro(){
    app_intro_alert(cTarget='homeTab', cTitle='<p style="color:#ff6584">Home Tab: You can search patterns and their data here</p>',
        cHtml='<p class="introHomeText">First time it could show empty warning. To avoid '+
        'that warning, you can import pattern database or generate database locally in further steps.</p>'+
        '<div class="neverHomeIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="homeIntroSkip" onclick="stop_app_intro()">Skip</div>'+
        '<div class="homeIntroNext" onclick="next_intro_alert(downloaded_database_tab_intro())" style="color:#f9a825">Next</div></div>', 
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


//STEP 2: Teach to import downloaded database
function downloaded_database_tab_intro(){
    app_intro_alert(cTarget='importDownDB', cTitle='',
        cHtml='<p class="introDownDbTitle">Database: Here you can import downloaded database</p>'+
        '<p class="introDownDbText">If you don\'t have any database then download it from <a href=\'#\' style="color:#5A81AE">here</a>'+
        ' and then copy paste that database in above "INPUT FOLDER".</br>'+
        'Once you have imported downloaded database then you can search pattern on home tab.</p>'+
        '<div class="downDbIntroNever" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="downDbSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="downDbNextIntro" onclick="next_intro_alert(process_analyze_tab_intro())" style="color:#f9a825">Next</div></div>', 
        cPosition='bottom-start',
        cClass = {
            popup: 'databaseIntroAlert',
            confirmButton: 'introConfirmAlert',
            title: 'introDownDbTitle',
            },
        cOnOpen = ()=>{
            document.getElementById("impDownDB").click();
            document.getElementById("databaseTabButton").click();
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
            document.querySelector("#importDownStop").style.pointerEvents = 'all';
            document.querySelector("#importDownStart").style.pointerEvents = 'all';
            document.querySelector("#databaseLowerBox").style.visibility = 'visible';
            document.querySelector("#databaseLowerBox").style.opacity = '1';
        },
    );
}

//STEP 3: Teach to import downloaded database
function process_analyze_tab_intro(){
    app_intro_alert(cTarget='multiUserTabID', cTitle='<p style="color:#78126A">Analyze Tab: Here you can process raw data locally</p>',
        cHtml='<p class="processIntroText">*Process raw data to detect patterns in them</br>'+
        '*Raw data implies to raw emails and passwords pairs, data files should have plain text in them (txt, csv and no-extension).</br>'+
        '*Required data format => email:password</br>'+
        '*After putting data in input folder, you can start analyzation process with suitable number of threads.'+
        '</p>'+
        '<div class="neverProcessIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="processSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="processNextIntro" onclick="next_intro_alert(process_stats_tab_intro())" style="color:#f9a825">Next</div></div>', 
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

//STEP 4: Teach to import downloaded database
function process_stats_tab_intro(){
    app_intro_alert(cTarget='multiUserTabID', cTitle='<p style="color:#E86135">Statistics Tab: Here you can generate stats of analyzed patterns</p>',
        cHtml='<p class="processIntroText">*Generate statistics of analyzed patterns</br>'+
        '*In previous step we generated patterns out of raw data, now we can create stats of those patterns.</br>'+
        '*Once stats are generated then you will be shown pattern categories and their data.</br></p>'+
        '<div class="neverProcessIntro" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="processSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="processNextIntro" onclick="next_intro_alert(import_database_tab_intro())" style="color:#f9a825">Next</div></div>', 
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


//STEP 5: Teach to import locally generated pattern in database
function import_database_tab_intro(){
    app_intro_alert(cTarget='importDB', cTitle='',
        cHtml='<p class="introDownDbTitle" style="color:#AE1100">Database: Here you can import downloaded database</p>'+
        '<p class="introDownDbText">The stats generated in previous step could be imported in this tab, you can check input in "DATABASE INPUT FOLDER". '+
        'Once import process completes then you will be able to search patterns in home tab, which processed locally.</p>'+
        '<div class="downDbIntroNever" onclick="never_show_intro()">Never Show again</div>'+
        '<div class="introSkipNextDiv">'+
        '<div class="downDbSkipIntro" onclick="stop_app_intro()">Skip</div>'+
        '<div class="downDbNextIntro" onclick="intro_is_completed()" style="color:#f9a825">Next</div></div>', 
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

//STEP 6: TUTORIAL IS COMPLETED
function intro_is_completed(){
    app_intro_alert(cTarget='homeTab', cTitle='<p style="color:#f9a825">That\'s it</p>',
        cHtml='<div class="completedIntroSkip" onclick="never_show_intro()" style="color:#f9a825">DONE</div>', 
        cPosition='center',
        cClass = {
            popup: 'askForIntroAlert',
            confirmButton: 'introConfirmAlert',
            title: 'askIntroTitle',
            content: 'completedIntroContent'
            },
        cOnOpen = ()=>{
        },
        cOnClose = ()=>{
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

async function zero_intro_count(){
    await database.UserData.where("key").equals("showAppIntro").modify({"value": 0});
}