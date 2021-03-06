//REQUIRE PATH PACKAGE TO HANDLE FILE ADDRESSES
const path = require('path');

//IMPORT BrowserWindow TO CREATE CHILD WINDOWS
const { BrowserWindow } = require('electron').remote;
//dark mode
const nativeTheme = remote.nativeTheme;

//REQUIRE SHELL TO OPEN DEFAULT APPLICATION LIKE TEXT EDITOR WITH A DATAFILE IN IT
const shell = require('electron').shell;

//REQUIRE FILE SYSTEM
const fs = require('fs');

//REQUIRE DATABASE SCRIPT
const { equals_any_of, get_address_of_pattern_file } = require('./scripts/databaseInit.js');

/**
 * FUNCTION TO OPEN INPUT FOLDER OF ANALYZATION PROCESS
 */
function input_of_analyzing(){
	
	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(process.resourcesPath, '..','data', 'Input'))){
        shell.openExternal(path.join('file://', process.resourcesPath, '..','data', 'Input'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Input'))){
        shell.openExternal(path.join('file://', __dirname, '..','data', 'Input'));
    }else{
        console.error('data/Input/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}

/**
 * FUNCTION TO OPEN OUTPUT FOLDER OF ANALYZATION PROCESS
 */
function output_of_analyzing(){
	
	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(process.resourcesPath, '..','data', 'Output'))){
        shell.openExternal(path.join('file://', process.resourcesPath, '..','data', 'Output'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Output'))){
        shell.openExternal(path.join('file://', __dirname, '..','data', 'Output'));
    }else{
        console.error('data/Output/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * FUNCTION TO OPEN INPUT FOLDER OF STATS GENERATOR.
 * WHICH HAPPENS TO BE OUTPUT FOLDER OF ANALYZATION PROCESS.
 */
function input_of_stats_generator(){

	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(process.resourcesPath, '..','data', 'Output'))){
        shell.openExternal(path.join('file://', process.resourcesPath, '..','data', 'Output'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Output'))){
        shell.openExternal(path.join('file://', __dirname, '..','data', 'Output'));
    }else{
        console.error('data/Output/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * FUNCTION TO OPEN OUTPUT FOLDER OF STATS GENERATOR AND PATTERN 
 * CATEGORY FILE IN DEFAULT TEXT EDITOR.
 */
function output_of_stats_generator(){
	
	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(process.resourcesPath, '..','data', 'Stats', 'Patterns Data'))){
        shell.openExternal(path.join('file://', process.resourcesPath, '..','data', 'Stats', 'Patterns Data'));
    }else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Stats', 'Patterns Data'))){
        shell.openExternal(path.join('file://', __dirname, '..', 'data', 'Stats', 'Patterns Data'));
    }else{
		console.error('data/Stats/Patterns Data/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}

/**
 * FUNCTION TO OPEN A NEW WINDOW WITH SAMPLE OF GENERATED PATTERN CATEGORIES
 * THIS WINDOW WILL ONLY CONTAIN AT MAX 100 SAMPLES BUT WILL TELL USER TOTAL COUNT.
 */
function sample_of_pattern_categories(){
	//open a new window to show generated pattern categories 
	categoryWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Categories", autoHideMenuBar: true, 
	frame: false, backgroundColor: '#F2F2F2', webPreferences: {nodeIntegration: true,}});
	categoryWindow.loadFile('./source/htmls/patternsCategories.html');
}


/**
 * FUNCTION TO OPEN IMPORT EXPORT DATABASE FOLDER 
 */
function database_import_export_folder(){
	
	//double if statement to avoid path error because of asar packaging of electron app
	if(fs.existsSync(path.join(process.resourcesPath, '..','data', 'Database'))){
		shell.openExternal(path.join('file://', process.resourcesPath, '..','data', 'Database'));
    }else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Database'))){
		shell.openExternal(path.join('file://', __dirname, '..', 'data', 'Database'));
    }else{
		console.error('data/Database/ folder doesn\'t exist');
    }
	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * FUNCTION TO OPEN SELECTED PATTERN'S DATA FILE IN NEW WINDOW. 
 * THIS FUNCTION MAKES A DATABASE QUERY TO GET ADDRESS OF SELECTED PATTERN
 * AND OPEN IT IN DEFAULT TEXT EDITOR.
 */
function pattern_lookup(){
	
	//get value of pattern entered by user
	var input = document.querySelector("#patternSearchInput").value;
	if(input==""){
		home_pattern_error("Empty", "warning");
		return;
	}

	//create a new widow to show pattern data
	patternDataWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Data", autoHideMenuBar: true, 
	frame: false, backgroundColor: '#F2F2F2', webPreferences: {nodeIntegration: true,}});
	patternDataWindow.loadFile('./source/htmls/patternData.html');

	//get address of selected pattern  >>APP_FOLDER/source/scripts/databaseInit.js<<
	get_address_of_pattern_file(input).then(function(result) {
		var fileAddress;
		for (i = 0; i < result.length; i++) {
			
			//shell.openItem(path.join(__dirname, '..',result[i]));
			fileAddress = result[i];
			//pass pattern file address and pattern string
			patternDataWindow.webContents.on('did-finish-load', () => {
				patternDataWindow.webContents.send('message', input, fileAddress);
			});
			
			//alert sound should be played finally in all conditions
			shell.beep();
		}
	});
	document.querySelector("#patternSearchInput").value = '';
}

/**
 * FUNCTION TO GENERATE A PASSWORDS AND PATTERNS BASED ON GIVEN INFORMATION
 * OF A PARTICULAR TARGET.
 * STEP 1. CHECK IF ALL REQUIRED PARAMETERS IS GIVEN BY USER
 * STEP 2. CHECK IF PARAMETERS ARE VALID 
 * STEP 3. COLLECT ALL THE PARAMETERS IN AN ARRAY TO PASS ON TO DATABASE LOOKUP FUNCTION
 * STEP 4. ADD PATTERN SELECTED BY USER AND PLACE IT  AT THE TOP OF THE LIST
 * STEP 5. CHANGE PATTERNS RETURNED BY DATABASE LOOKUP FUNCTION TO REFLECT TARGET USER INFORMATION
 * STEP 6. OPEN A NEW WINDOW TO DISPLAY ORIGINAL PATTERNS AND GENERATED SEMI-PASSWORDS/PATTERNS
 */
function target_user_pattern(){
	
	//capture email given by user
	const email = document.querySelector("#targetEmail").value;
	//capture password given by user
	const password = document.querySelector("#targetPassword").value;
	
	//if email field is empty then warn user
	if(email != ''){
		
		//if email is invalid then warn user
        if(email.indexOf("@") != -1 && email.indexOf(".") != -1){
			
			//if user entered a password then this will call a function to- 
			//display patterns in that password
			if(password!=''){
				//>>APP_FOLDER/source/scripts/process.js<<
				target_password_patterns(password, email);
			}

			//array to store form values
            var targetData = [];

            //extract email name
            targetData.push({value:email.substring(0, email.indexOf("@")), type:'email_Name'});

            //extract website
            targetData.push({value:email.substring(email.indexOf("@")+1, email.indexOf(".")), type:'Website'});

            //get name value
			targetData.push({value:document.querySelector("#targetName").value, type:'Name'});

            //get location value
			targetData.push({value:document.querySelector("#targetLocation").value, type:'Location'});

            //get dob value
			targetData.push({value:document.querySelector("#targetDob").value, type:'DOB'});

            //get mobile value
			targetData.push({value:document.querySelector("#targetMobile").value, type:'Mobile'});

            //collect data entries which have been given, then remove empty ones
            var temp = [];
            for(var i=0; i<targetData.length; i++){
                if(targetData[i].value!=''){
					temp.push(targetData[i].type);
                }else{
					targetData.splice(i, 1);
				}
			}

            //find top most popular pattern matching given data >>APP_FOLDER/source/scripts/databaseInit.js<<
            equals_any_of(temp).then(function(passwordPatterns) {

				//array to store generated password reflecting actual info given by user
				var generatedPasswords = [];

				//temp string to store original pattern
				var tempStr;
				
				//add pattern selected by user
				if(document.querySelector("#patternSearchInput").value != ''){
					passwordPatterns.unshift({pattern:document.querySelector("#patternSearchInput").value, address:'', popularity:''});
				}

				//take all the patterns and interpolate given information into them
                for(var i=0; i<passwordPatterns.length; i++){
					tempStr = passwordPatterns[i].pattern;
					for(var j=0; j<targetData.length; j++){
						//replace all occurrences of tags into value given by user
						passwordPatterns[i].pattern = replaceAll(passwordPatterns[i].pattern, targetData[j].type, targetData[j].value);
					}
					generatedPasswords.push({original:tempStr, generated:passwordPatterns[i].pattern});
				}
				
				document.querySelector("#patternSearchInput").value = '';

				setTimeout(function(){
					//update process status, make alert sound
					shell.beep();
					//create a window to display suggested patterns
					suggestionsWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Categories", autoHideMenuBar: true, 
					frame: false, backgroundColor: '#F2F2F2', webPreferences: {nodeIntegration: true,}});
					suggestionsWindow.loadFile('./source/htmls/targetSuggestions.html');
					//pass suggested patterns array to that window
					suggestionsWindow.webContents.on('did-finish-load', () => {
						suggestionsWindow.webContents.send('message', generatedPasswords);
					});
				},1200);

				//target user loading alert >>APP_FOLDER/source/scripts/alerts.js<<
				target_alerts(cTarget='targetContentContainer', cTitle='Processing', cClass='targetAlerts', cTime=2000);
			});
			
			//clear array
			temp.length =0;
			return;
        }else{
			//Warn: invalid email
            console.log("invalid email");
            return;
        }
    }else{
        //Warn: enter required fields
		console.log("Enter required fields");
		return;
    }
}


/**
 * HELPER FUNCTION TO FIND AND REPLACE A SUBSTRING
 * THIS FUNCTION WILL FIND AND REPLACE ALL OCCURRENCES OF SUBSTRING
 * @param {string} targetString MAIN STRING WHICH CONTAINS SMALLER STRINGS
 * @param {string} findString SUBSTRING WHICH NEED TO BE FOUND IN MAIN STRING
 * @param {string} replaceString STRING WHICH WILL BE REPLACED AT THE PLACE OF SUBSTRING
 */
function replaceAll(targetString, findString, replaceString) {
    return targetString.replace(new RegExp(escapeRegExp(findString), 'g'), replaceString);
}

/**
 * HELPER FUNCTION TO ESCAPE SPECIAL CHARACTERS WHILE FINDING
 * SUBSTRING IN MAIN STRING
 * @param {string} targetString MAIN STRING
 */
function escapeRegExp(targetString) {
    return targetString.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * FUNCTION TO COLLECT AND CHECK INPUT PASSWORD AND EMAIL(OPTIONAL).
 * IF EVERYTHING IS FINE THEN CALL WEB WORKER FUNCTION TO DETECT
 * PATTERN IN THIS PASSWORD.
 */
function catch_target_password(){

	//get password value
	var password = document.querySelector("#singleUserPassword").value;
	//get email value
	var email = document.querySelector("#singleUserEmail").value;

	//if email is empty 
	if(email == ''){
		email = "";
	}
	//Call function to process password and generate patterns >>APP_FOLDER/source/scripts/process.js<<
	target_password_patterns(password, email);
}


/**
 * FUNCTION TO DISPLAY RESULTED PATTERNS GENERATED BY PROCESSING SINGLE
 * PASSWORD AND EMAIL(OPTIONAL)
 * @param {string} detectedData RESULTED PATTERNS BASED ON PASSWORD ENTERED BY USER 
 */
function process_single_password(detectedData){
	//create a new window to display suggested patterns
	targetPasswordWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Categories", autoHideMenuBar: true, 
	frame: false, backgroundColor: '#F2F2F2', webPreferences: {nodeIntegration: true,}});
	targetPasswordWindow.loadFile('./source/htmls/targetPattern.html');
	//pass suggested patterns array to that window
	targetPasswordWindow.webContents.on('did-finish-load', () => {
		targetPasswordWindow.webContents.send('message', detectedData);
	});
}


/**
 * FUNCTION TO CHANGE APP THEME BASED ON USER PREFERENCE.
 * THIS WILL CHECK USER PREFERENCE IN LOCAL-STORAGE DATABASE -
 * AND CHANGE CSS IDENTIFIER AND SOME VARIABLES ACCORDING TO THEME.
 * LASTLY UPDATE THEME VALUE IN DATABASE 
 */
function set_app_theme(){
	if(window.localStorage.user_theme == 'dark'){ //dark theme
		//change theme icon and button background
		document.querySelector(".appThemeIcon").src = "assets/icons/light_mode.svg";
		document.querySelector(".themeChangeButton").style.backgroundColor = "var(--dark-grey)";
		//change search bar internal icon
		document.querySelector(".patternSearchBar").style.backgroundImage = "url(assets/icons/search-icon-white.svg)";
		//change home image (dark-mode)
		document.querySelector("#homeImage").src = "assets/images/home-page-image-dark.svg";
		//decrease home images brightness
		document.querySelector(".homeDecor1").style.filter = "brightness(75%)";
		document.querySelector(".homeDecor2").style.filter = "brightness(75%)";
		//change nav tab icons color according to dark-mode
		//all the tab icons are black without these filters
		document.querySelector("#target_button_icon").style.filter = "invert(64%) sepia(89%) saturate(1210%) hue-rotate(185deg) brightness(88%) contrast(92%)";
		document.querySelector("#process_button_icon").style.filter = "invert(59%) sepia(67%) saturate(4413%) hue-rotate(340deg) brightness(94%) contrast(92%)";
		document.querySelector("#home_button_icon").style.filter = "invert(37%) sepia(47%) saturate(5355%) hue-rotate(330deg) brightness(96%) contrast(86%)";
		document.querySelector("#database_button_icon").style.filter = "invert(60%) sepia(56%) saturate(581%) hue-rotate(102deg) brightness(97%) contrast(85%)";
		document.querySelector("#document_button_icon").style.filter = "invert(83%) sepia(20%) saturate(861%) hue-rotate(350deg) brightness(104%) contrast(90%)";
		//change process tab svg filters
		document.querySelector("#arrowIcon").style.filter = "invert(8%) sepia(5%) saturate(332%) hue-rotate(201deg) brightness(95%) contrast(89%)";
		//change database tab svg filters
		document.querySelector(".deleteIcon").style.filter = "invert(8%) sepia(5%) saturate(332%) hue-rotate(201deg) brightness(95%) contrast(89%)";
		//SET DARK-MODE ATTRIBUTE IN INDEX.HTML
		document.querySelector("#appBody").setAttribute("data-theme", "dark");
		//save user preference
		window.localStorage.user_theme = 'dark';
		nativeTheme.themeSource = 'dark';
		console.log('dark theme activated');
    }else{
		//change theme icon and button background
		document.querySelector(".appThemeIcon").src = "assets/icons/dark_mode.svg";
		document.querySelector(".themeChangeButton").style.backgroundColor = "#121312";
		//change search bar internal icon
		document.querySelector(".patternSearchBar").style.backgroundImage = "url(assets/icons/search-icon.svg)";
		//change home image (light-mode) 
		document.querySelector("#homeImage").src = "assets/images/home-page-image.svg";
		//increase home images brightness
		document.querySelector(".homeDecor1").style.filter = "brightness(100%)";
		document.querySelector(".homeDecor2").style.filter = "brightness(100%)";
		//change nav tab icons color according to light-mode
		//all the tab icons are black without these filters
		document.querySelector("#target_button_icon").style.filter = "invert(54%) sepia(80%) saturate(398%) hue-rotate(102deg) brightness(101%) contrast(93%)";
		document.querySelector("#process_button_icon").style.filter = "invert(90%) sepia(28%) saturate(4837%) hue-rotate(333deg) brightness(94%) contrast(108%)";
		document.querySelector("#home_button_icon").style.filter = "invert(66%) sepia(60%) saturate(4408%) hue-rotate(312deg) brightness(103%) contrast(105%)";
		document.querySelector("#database_button_icon").style.filter = "invert(55%) sepia(17%) saturate(1098%) hue-rotate(173deg) brightness(104%) contrast(93%)";
		document.querySelector("#document_button_icon").style.filter = "invert(42%) sepia(9%) saturate(891%) hue-rotate(204deg) brightness(91%) contrast(85%)";
		//change process tab icons svg filters
		document.querySelector("#arrowIcon").style.filter = "invert(98%) sepia(31%) saturate(244%) hue-rotate(230deg) brightness(110%) contrast(90%)";
		//change database tab svg filters
		document.querySelector(".deleteIcon").style.filter = "invert(100%) sepia(0%) saturate(3482%) hue-rotate(184deg) brightness(122%) contrast(81%)";
		//SET LIGHT-MODE ATTRIBUTE IN INDEX.HTML
		document.querySelector("#appBody").setAttribute("data-theme", "light");
		//save user preference
		window.localStorage.user_theme = 'light';
		nativeTheme.themeSource = 'light';
		console.log('light theme activated');
    }
}