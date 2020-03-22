//REQUIRE PATH PACKAGE TO HANDLE FILE ADDRESSES
const path = require('path');

//IMPORT BrowserWindow TO CREATE CHILD WINDOWS
const { BrowserWindow } = require('electron').remote;

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
        shell.openExternal(path.join(process.resourcesPath, '..','data', 'Input'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Input'))){
        shell.openExternal(path.join(__dirname, '..','data', 'Input'));
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
        shell.openExternal(path.join(process.resourcesPath, '..','data', 'Output'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Output'))){
        shell.openExternal(path.join(__dirname, '..','data', 'Output'));
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
        shell.openExternal(path.join(process.resourcesPath, '..','data', 'Output'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Output'))){
        shell.openExternal(path.join(__dirname, '..','data', 'Output'));
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
        shell.openExternal(path.join(process.resourcesPath, '..','data', 'Stats', 'Patterns Data'));
    }else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Stats', 'Patterns Data'))){
        shell.openExternal(path.join(__dirname, '..', 'data', 'Stats', 'Patterns Data'));
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
		shell.openExternal(path.join(process.resourcesPath, '..','data', 'Database'));
    }else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Database'))){
		shell.openExternal(path.join(__dirname, '..', 'data', 'Database'));
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
