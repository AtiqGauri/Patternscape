// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


//require path package to handle file addresses
const path = require('path');

//import BrowserWindow to create child windows
const { BrowserWindow } = require('electron').remote;

//require shell to open default application like text editor with a datafile in it
const shell = require('electron').shell;

//require file system
const fs = require('fs');

//require database script
const { equals_any_of, get_address_of_pattern_file } = require('./scripts/databaseInit.js');


/**
 * Function to open input folder of analyzation process
 */
function input_of_analyzing(){
	
	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(__dirname, '..', '..', '..','data', 'Input'))){
        shell.openExternal(path.join(__dirname, '..', '..', '..','data', 'Input'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Input'))){
        shell.openExternal(path.join(__dirname, '..','data', 'Input'));
    }else{
        console.error('data/Input/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}

/**
 * Function to open output folder of analyzation process
 */
function output_of_analyzing(){
	
	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(__dirname, '..', '..', '..','data', 'Output'))){
        shell.openExternal(path.join(__dirname, '..', '..', '..','data', 'Output'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Output'))){
        shell.openExternal(path.join(__dirname, '..','data', 'Output'));
    }else{
        console.error('data/Output/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * Function to open input folder of stats generator.
 * Which happens to be output folder of analyzation process.
 */
function input_of_stats_generator(){

	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(__dirname, '..', '..', '..','data', 'Output'))){
        shell.openExternal(path.join(__dirname, '..', '..', '..','data', 'Output'));
    }else if(fs.existsSync(path.join(__dirname, '..','data', 'Output'))){
        shell.openExternal(path.join(__dirname, '..','data', 'Output'));
    }else{
        console.error('data/Output/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * Function to open output folder of Stats generator and pattern 
 * category file in default text editor.
 */
function output_of_stats_generator(){
	
	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns Data'))){
        shell.openExternal(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns Data'));
    }else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Stats', 'Patterns Data'))){
        shell.openExternal(path.join(__dirname, '..', 'data', 'Stats', 'Patterns Data'));
    }else{
		console.error('data/Stats/Patterns Data/ folder doesn\'t exist');
    }

	categoryWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Categories",webPreferences: {nodeIntegration: true,}});
	categoryWindow.loadFile('./source/htmls/patternsCategories.html');

	//alert sound should be played finally in all conditions
	shell.beep();
}

/**
 * Function to open import export database folder 
 * 
 */
function database_import_export_folder(){
	
	//double if statement to avoid path error because of asar packaging of electron app
    if(fs.existsSync(path.join(__dirname, '..', '..', '..','data', 'Database'))){
		//shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Database'));
		shell.openExternal(path.join(__dirname, '..', '..', '..','data', 'Database'));
    }else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Database'))){
		//shell.openItem(path.join(__dirname, '..', 'data', 'Database'));
		shell.openExternal(path.join(__dirname, '..', 'data', 'Database'));
    }else{
		console.error('data/Database/ folder doesn\'t exist');
    }

	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * Function to open pattern data file. This function
 * makes a database query to get address of selected pattern
 * and open it in default text editor.
 */
function pattern_lookup(){
	
	//get value of pattern entered by user
	var input = document.getElementById("patternSearchInput").value;

	//create a widow to show pattern data
	patternDataWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Data",webPreferences: {nodeIntegration: true,}});
	patternDataWindow.loadFile('./source/htmls/patternData.html');

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
}

/**
 * Function to generate a passwords and patterns based on given information
 * of a particular target.
 * Step 1. check if all required parameters is given by user
 * Step 2. check if parameters are valid 
 * Step 3. collect all the parameters in an array to pass on to database lookup function
 * Step 4. add pattern selected by user and place it  at the top of the list
 * Step 5. change patterns returned by database lookup function to reflect target user information
 * Step 6. open a new window to display original patterns and generated semi-passwords/patterns
 */
function target_user_pattern(){
	
	//capture email given by user
	const email = document.getElementById("targetEmail").value;
	//capture password given by user
	const password = document.getElementById("targetPassword").value;
	
	//if email field is empty then warn user
	if(email != ''){
		
		//if email is invalid then warn user
        if(email.indexOf("@") != -1 && email.indexOf(".") != -1){
			
			//if user entered a password then this will call a function to- 
			//display patterns in that password
			if(password!=''){
				target_password_patterns(password, email);
			}

			
            var targetData = [];

            //extract email name
            targetData.push({value:email.substring(0, email.indexOf("@")), type:'email_Name'});

            //extract website
            targetData.push({value:email.substring(email.indexOf("@")+1, email.indexOf(".")), type:'Website'});

            //get name value
			targetData.push({value:document.getElementById("targetName").value, type:'Name'});

            //get location value
			targetData.push({value:document.getElementById("targetLocation").value, type:'Location'});

            //get dob value
			targetData.push({value:document.getElementById("targetDob").value, type:'DOB'});

            //get mobile value
			targetData.push({value:document.getElementById("targetMobile").value, type:'Mobile'});

            //collect data entries which have been given, then remove empty ones
            var temp = [];
            for(var i=0; i<targetData.length; i++){
                if(targetData[i].value!=''){
					temp.push(targetData[i].type);
                }else{
					targetData.splice(i, 1);
				}
			}

            //find top most popular pattern matching given data 
            equals_any_of(temp).then(function(passwordPatterns) {

				//array to store generated password reflecting actual info given by user
				var generatedPasswords = [];

				//temp string to store original pattern
				var tempStr;
				
				//add pattern selected by user
				if(document.getElementById("patternSearchInput").value != ''){
					passwordPatterns.unshift({pattern:document.getElementById("patternSearchInput").value, address:'', popularity:''});
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
				
				document.getElementById("patternSearchInput").value = '';

				//create a window to display suggested patterns
				suggestionsWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Categories",webPreferences: {nodeIntegration: true,}});
				suggestionsWindow.loadFile('./source/htmls/targetSuggestions.html');
				//pass suggested patterns array to that window
				suggestionsWindow.webContents.on('did-finish-load', () => {
					suggestionsWindow.webContents.send('message', generatedPasswords);
				});
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
 * Helper function to find and replace a substring
 * This function will find and replace all occurrences of substring
 * @param {string} targetString main string which contains smaller strings
 * @param {string} findString substring which need to be found in main string
 * @param {string} replaceString string which will be replaced at the place of substring
 */
function replaceAll(targetString, findString, replaceString) {
    return targetString.replace(new RegExp(escapeRegExp(findString), 'g'), replaceString);
}

/**
 * Helper function to escape special characters while finding
 * substring in main string
 * @param {string} targetString main string
 */
function escapeRegExp(targetString) {
    return targetString.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

/**
 * Function to collect and check input password and email(optional).
 * if everything is fine then call web worker function to detect
 * pattern in this password.
 */
function catch_target_password(){

	//get password value
	var password = document.getElementById("singleUserPassword").value;
	//get email value
	var email = document.getElementById("singleUserEmail").value;

	//if password is empty then warn user
	if(password==''){
		//show that this wrong enter password
		console.log("Password is required");
		return;
	}

	//if email is empty 
	if(email == ''){
		email = "";

		//if email is invalid then warn user
	}else if(email.indexOf("@") == -1 || email.indexOf(".") == -1){
		//show that email is invalid
		console.log("invalid email");
		return;
	}

	//when check is passed then call function to process password and generate patterns
	target_password_patterns(password, email);
}


/**
 * Function to display resulted patterns generated by processing single
 * password and email(optional)
 * @param {string} detectedData resulted patterns based on password entered by user 
 */
function process_single_password(detectedData){
	
	//create a window to display suggested patterns
	targetPasswordWindow = new BrowserWindow({width: 1280, height: 720, title: "Pattern Categories",webPreferences: {nodeIntegration: true,}});
	targetPasswordWindow.loadFile('./source/htmls/targetPattern.html');
	//pass suggested patterns array to that window
	targetPasswordWindow.webContents.on('did-finish-load', () => {
		targetPasswordWindow.webContents.send('message', detectedData);
	});
}