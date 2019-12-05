// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.


//require path package to handle file addresses
const path = require('path');

//require shell to open default application like text editor with a datafile in it
const shell = require('electron').shell;

//require database script
const { get_address_of_pattern_file } = require('./database.js');
const { equals_any_of } = require('./database.js');

//**** IMPORTANT ****
//*DEVELOPMENT or PRODUCTION* If you are developing the app use then true else false
//otherwise app can crash
const isDevMode = true;


/**
 * Function to open input folder of analyzation process
 */
function input_of_analyzing(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Input'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Input'));
	}

	//alert sound should be played finally in all conditions
	shell.beep();
}

/**
 * Function to open output folder of analyzation process
 */
function output_of_analyzing(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Output'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Output'));
	}

	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * Function to open input folder of stats generator.
 * Which happens to be output folder of analyzation process.
 */
function input_of_stats_generator(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Output'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Output'));
	}

	//alert sound should be played finally in all conditions
	shell.beep();
}


/**
 * Function to open output folder of Stats generator and pattern 
 * category file in default text editor.
 */
function output_of_stats_generator(){
	
	if(isDevMode){
		shell.openItem(path.join(__dirname, '..','data', 'Stats', 'Patterns Data'));
		shell.openItem(path.join(__dirname, '..','data', 'Stats', 'Patterns.txt'));
	} else {
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns Data'));
		shell.openItem(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns.txt'));
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
	
	var input = document.getElementById("patternBar").value;
	get_address_of_pattern_file(input).then(function(result) {

		for (i = 0; i < result.length; i++) {
			
			if(isDevMode){
				shell.openItem(path.join(__dirname, '..',result[i]));
			} else {
				shell.openItem(path.join(__dirname, '..', '..', '..', result[i]));
			}
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
	const email = document.getElementById("emailBar").value;

	if(email != ''){
        
        if(email.indexOf("@") != -1 && email.indexOf(".") != -1){
            //Reflect process is started 
            document.getElementById("generatedPass").innerHTML = ('Generating passwords');
            
            var targetData = [];

            //extract email name
            targetData.push({value:email.substring(0, email.indexOf("@")), type:'email_Name'});

            //extract website
            targetData.push({value:email.substring(email.indexOf("@")+1, email.indexOf(".")), type:'Website'});

            //get name value
			targetData.push({value:document.getElementById("nameBar").value, type:'Name'});

            //get location value
			targetData.push({value:document.getElementById("locationBar").value, type:'Location'});

            //get dob value
			targetData.push({value:document.getElementById("dobBar").value, type:'DOB'});

            //get mobile value
			targetData.push({value:document.getElementById("mobileBar").value, type:'Mobile'});

            //collect data entries which have been given and remove empty ones
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
				if(document.getElementById("selectBar").value != ''){
					passwordPatterns.unshift({pattern:document.getElementById("selectBar").value, address:'', popularity:''});
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
				
				//open a new window to display generated passwords and patterns
				let passwordsWindow = window.open('', 'Generated_Passwords');
				passwordsWindow.document.write(JSON.stringify(generatedPasswords));
			});
			
			//clear array
			temp.length =0;
			return;
        }else{
			//Reflect invalid email
            document.getElementById("generatedPass").innerHTML = ('Enter a valid Email');
            return;
        }
    }else{
        //Warn to enter required fields
		document.getElementById("generatedPass").innerHTML = ('* Complete Required Fields');
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