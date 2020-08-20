/**
 * FUNCTION TO CHANGE SUB-TABS IN PROCESS WINDOW
 * IT WILL FIRST SET "display:none" IN ALL SUB-TABS
 * THEN IT WILL SET "display:block" IN SELECTED TAB 
 * @param {event} evt REFERENCE TO EVENT ELEMENT  
 * @param {id} tabName ID FOR TAB NAME WHICH WILL BE DISPLAYED
 */
function open_process_tabs(evt, tabName) {
    var i, processTabContent, processTabLinks;
    processTabContent = document.getElementsByClassName("processTabContent");
    for (i = 0; i < processTabContent.length; i++) {
        processTabContent[i].style.display = "none";
    }
    processTabLinks = document.getElementsByClassName("processTabLinks");
    for (i = 0; i < processTabLinks.length; i++) {
        processTabLinks[i].className = processTabLinks[i].className.replace(" active", "");
    }
    document.querySelector('#'+tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

/**
 * FUNCTION FOR THREAD SLIDER IN PROCESS TAB
 * THIS WILL UPDATE UI DEPENDING ON USER INPUT
 */
function process_thread_selection(){
    var elem = document.querySelector('input[type="range"]');
    var rangeValue = function(){
    var newValue = elem.value;
    var target = document.querySelector("#valueLabel");
    target.innerHTML = newValue;
    }
    elem.addEventListener("input", rangeValue);
}

/**
 * FUNCTION FOR CHANGE TAB BUTTON IN PROCESS TAB
 * THIS WILL TOGGLE BUTTON CSS CLASS DEPENDING ON USER CLICK AND HOVER 
 */
var analyseOrStats = false;
function change_analyse_to_stats(){
    var arrowClass = document.querySelector("#changeUserTypes");
    var analyseElement = document.querySelector("#processRawData");
    var statElement = document.querySelector("#statsGeneration");

	//assign opposite value to button change state
    if(analyseOrStats==true){
        analyseOrStats=false;
    }else{
        analyseOrStats= true;
    }

	//change color depending on button change state
    if(analyseOrStats!=true){
        arrowClass.style.backgroundColor = "var(--processAnalyze-text)";
        analyseElement.style.display = "block";
        statElement.style.display = "none";
    }else{
        arrowClass.style.backgroundColor = "var(--processStats-text)";
        statElement.style.display = "block";
        analyseElement.style.display = "none";

    }
}

/**
 * FUNCTION FOR CHANGE COLOR OF BUTTON IN PROCESS TAB
 * THIS WILL TOGGLE BUTTON CSS CLASS DEPENDING ON MOUSE HOVER
 */
function process_change_button(){
    document.querySelector("#changeUserTypes").onmouseover = function() {
        if(analyseOrStats!=true){
            this.style.backgroundColor = "var(--processStats-text)";
        }else{
            this.style.backgroundColor = "var(--processAnalyze-text)";
        }
    }
    document.querySelector("#changeUserTypes").onmouseout = function() {
        if(analyseOrStats!=true){
            this.style.backgroundColor = "var(--processAnalyze-text)";
        }else{
            this.style.backgroundColor = "var(--processStats-text)";
        }
    }
}

/**
 * FUNCTION TO CHECK VALIDITY OF USER FORM IN SINGLE USER TAB
 * IF FORM IS FILLED CORRECTLY THEN CALL PROCESSING CODE
 */
function singleUserForm(){
	targetForm = document.querySelector("#singleUserForm");
    // Form is invalid!
    if (!targetForm.checkValidity()) {
        // Create the temporary button, click and remove it
        var tmpSubmit = document.createElement('button');
        targetForm.appendChild(tmpSubmit);
        tmpSubmit.click();
        targetForm.removeChild(tmpSubmit);
    }else{
		//>>APP_FOLDER/source/scripts/renderer.js<<
        catch_target_password();
    }
}

//variable for web workers
var worker1; var worker2; var targetPasswordWorker;
//variables to check worker status
var bAnalyzer = true;
var bTarget = true;


/**********************************************************************************************
 * ANALYZE PROCESS WORKER FUNCTIONALITY
 **********************************************************************************************/
/**
 * FUNCTION TO CALL C++ ADDON API INTO A SEPARATE THREAD
 * THIS FUNCTION WILL DETECT PATTERNS OUT OF RAW EMAIL AND PASSWORDS
 * CHECK OUT DOCUMENTATION OR C++ CODE FOR MORE INFORMATION
 */
function analyze_passwords_emails(){
	//if process is not executing already
	if(bAnalyzer){
		bAnalyzer = false;

		//start loading bar
		document.querySelector("#progressAnimation").style.display = "block";
		
		//check if input is available in input folder
		//double if statement to avoid asar packaging path alteration
		if(fs.existsSync(path.join(process.resourcesPath, '..','data','Input'))){
			if(fs.readdirSync(path.join(process.resourcesPath, '..','data','Input')).length <= 1){
				//>>APP_FOLDER/source/scripts/alerts.js<<
				moving_forward_to_stats(cTitle='<b style="color:var(--processAnalyze-text);">No file available to analyze</b>', 
				cHtml='<b style="margin: 0 4vw 0 1vw;">copy paste files inside "Raw Data" folder, then try again (*consider required format)</b>',
				 cIcon='warning', cTime='600000', cConfirmButton=true, cCancelButton=false);
				document.querySelector("#progressAnimation").style.display = "none";
				bAnalyzer = true;
				return;
			}
		}else if(fs.existsSync(path.join(__dirname, '..','data','Input'))){
			if(fs.readdirSync(path.join(__dirname, '..','data','Input')).length <= 1){
				//>>APP_FOLDER/source/scripts/alerts.js<<
				moving_forward_to_stats(cTitle='<b style="color:var(--processAnalyze-text);">No file available to analyze</b>', 
				cHtml='<b style="margin: 0 4vw 0 1vw;">copy paste files inside "Raw Data" folder, then try again (*consider required format)</b>',
				 cIcon='warning', cTime='600000', cConfirmButton=true, cCancelButton=false);
				document.querySelector("#progressAnimation").style.display = "none";
				bAnalyzer = true;
				return;
			}
		}else{
			console.error('data/Input/ folder doesn\'t exist');
		}

		//initalizing web worker
		//if statement to make sure on one thread is working at a time
		if(worker1==undefined){
			worker1 = new Worker('threadWorkers/analyzationWorker.js');
			//block other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
			block_pattern_generation_functionality();
		}else{
			return;
		}
		
		//get user given thread number from GUI
		var threadNumber = document.querySelector('#threadSelectorInput').value;
		
		//pass thread number to web worker
		worker1.postMessage(threadNumber);

		//listen to webworker signals
		worker1.onmessage = function(event) {
			
			//print web worker acknowledgment then terminate it
			console.log("worker1 : ", event.data);
			
			//terminate webworker
			worker1.terminate();
			//set it to undefined
			worker1 = undefined; 

			shell.beep();
			
			//set process status variable
			bAnalyzer = true;

			document.querySelector("#progressAnimation").style.display = "none";

			//unblock other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
			unblock_pattern_generation_functionality();

			//direct user to generate stats after specified seconds
			//>>APP_FOLDER/source/scripts/alerts.js<<
			moving_forward_to_stats();
		};

		//handle exception or error thrown by web worker
		worker1.onerror = function (event) {
			console.log(event.message, event);

			//unblock other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
			unblock_pattern_generation_functionality();
			
			//terminate webworker
			worker1.terminate();
			//set it to undefined
			worker1 = undefined;
			//stop loading bar
			document.querySelector("#progressAnimation").style.display = "none";
			//>>APP_FOLDER/source/scripts/alerts.js<<
			moving_forward_to_stats(cTitle='<b style="color:var(--processAnalyze-text);">Error</b>', 
			cHtml='<b style="margin: 0 4vw 0 1vw;">'+ event.message +'</b>',
		 	cIcon='error', cTime='1800000');
		};
	}
}

/**
 * stop analyzation process if required
 */
function stop_analyze_passwords_emails(){
	//stop loading bar
	document.querySelector("#progressAnimation").style.display = "none";

	//unblock other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
	unblock_pattern_generation_functionality();

    if(worker1!=undefined){
        //terminate webworker
		worker1.terminate();
        //set it to undefined
		worker1 = undefined;

		//set process status variable
		bAnalyzer = true;

		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='processRawData', cTitle='Stopped', cIcon='warning', cClass='processStopAlerts');
	}else{
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='processRawData', cTitle='Empty', cIcon='info', cClass='processStopAlerts');
	}

}


/**********************************************************************************************
 * STATISTICS PROCESS WORKER FUNCTIONALITY
 **********************************************************************************************/
/**
 * FUNCTION TO CALL C++ ADDON API INTO A SEPARATE THREAD
 * THIS FUNCTION WILL CATEGORIES ALL THE PATTERNS AND THEIR RESPECTIVE DATAFILES.
 * THEN IT WILL STORE ALL CATEGORIZED PATTERN INTO A SINGLE FILE WITH THEIR DATAFILE ADDRESSES AND POPULARITY.
 */
function generate_statistics(){
	//stop loading bar
	document.querySelector("#progressAnimation").style.display = "block";

	//check if input files exists in input folder
	//double if statements to avoid asar packaging alteration
	if(fs.existsSync(path.join(process.resourcesPath, '..','data','Output'))){
		if(fs.readdirSync(path.join(process.resourcesPath, '..','data','Output')).length <= 1){
			//>>APP_FOLDER/source/scripts/alerts.js<<
			moving_forward_to_stats(cTitle='<b style="color:var(--processStats-text);">No file available to generate statistics</b>', 
			cHtml='<b style="margin: 0 4vw 0 1vw;">First analyze some raw data in previous analyzation process then try again</b>',
			 cIcon='warning', cTime='600000', cConfirmButton=true, cCancelButton=false);
			document.querySelector("#progressAnimation").style.display = "none";
			bAnalyzer = true;
			return;
		}
	}else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Output'))){
		if(fs.readdirSync(path.join(__dirname, '..', 'data', 'Output')).length <= 1){
			//>>APP_FOLDER/source/scripts/alerts.js<<
			moving_forward_to_stats(cTitle='<b style="color:var(--processStats-text);">No file available to generate statistics</b>', 
			cHtml='<b style="margin: 0 4vw 0 1vw;">First analyze some raw data in previous analyzation process then try again</b>',
			 cIcon='warning', cTime='600000', cConfirmButton=true, cCancelButton=false);
			document.querySelector("#progressAnimation").style.display = "none";
			bAnalyzer = true;
			return;
		}
	}else{
		console.error('data/Output/ folder doesn\'t exist');
	}


	//initalizing web worker
	//if statement to make sure only single thread is working at a time 
	if(worker2==undefined){
		worker2 = new Worker('threadWorkers/statisticsWorker.js');
		//block other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
		block_pattern_generation_functionality();
	}else{
		return;
	}
	
	//listen to webworker signals
	worker2.onmessage = function(event) {

		//print web worker acknowledgment then terminate it
		console.log("worker2 : ", event.data);
        worker2.terminate();
        //set it to undefined
		worker2 = undefined;

		shell.beep();

		//stop loading bar
		document.querySelector("#progressAnimation").style.display = "none";

		//unblock other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
		unblock_pattern_generation_functionality();

		//function to open a new window with a sample and total number- 
		//-of pattern categories >>APP_FOLDER/renderer.js<<
		sample_of_pattern_categories();

		//direct user to import data window
		//>>APP_FOLDER/source/scripts/alerts.js<<
		moving_forward_to_importDB();
	};

	//handle exception or error thrown by web worker
	worker2.onerror = function (event) {
		console.log(event.message, event);

		//unblock other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
		unblock_pattern_generation_functionality();

		//terminate webworker
        worker2.terminate();
        //set it to undefined
		worker2 = undefined;
		//stop progress bar
		document.querySelector("#progressAnimation").style.display = "none";
		//>>APP_FOLDER/source/scripts/alerts.js<<
		moving_forward_to_importDB(cTitle='<b style="color:var(--processStats-text);">Error</b>', 
		cHtml='<b style="margin: 0 4vw 0 1vw;">'+ event.message +'</b>',
		 cIcon='error', cTime='1800000');
	};
}

/**
 * STOP STATS GENERATION PROCESS IF REQUIRED
 */
function stop_generate_statistics(){
	//stop loading bar
	document.querySelector("#progressAnimation").style.display = "none";

	//unblock other resource heavy processes //>>APP_FOLDER/source/scripts/process.js<<
	unblock_pattern_generation_functionality();

    if(worker2!=undefined){
        //terminate webworker
        worker2.terminate();

        //set it to undefined
		worker2 = undefined;
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='statsGeneration', cTitle='Stopped', cIcon='warning', cClass='processStopAlerts');
	}else{
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='statsGeneration', cTitle='Empty', cIcon='info', cClass='processStopAlerts');
	}
}


/**********************************************************************************************
 * SINGLE USER TARGET WORKER FUNCTIONALITY
 **********************************************************************************************/
/**
 * FUNCTION TO PROCESS A SINGLE PASSWORD AND GENERATE/DISPLAY PATTERNS OUT OF IT.
 * @param {string} password PATTERNS ARE GONNA BE DETECTED BY PROCESSING THIS PASSWORD 
 * @param {string} email EMAIL FOR THE PASSWORD(OPTIONAL) (DEFAULT=*****@*****.COM)
 * THIS USES A WEB WORK TO PROCESS ASYNCHRONOUSLY.
 * WHEN FINISHED IT WILL CALL RENDERER.JS FILE FUNCTION TO DISPLAY RESULTING PATTERNS
 */
function target_password_patterns(password, email){	
	//check if same process is not running in background then start this
	if(bTarget){
		//process started in background
		bTarget = false;

		document.querySelector("#singleUserSubmit").disabled = true;

		//initalizing web worker
		//if statement to make sure only one thread is working at a time
		if(targetPasswordWorker==undefined){
			targetPasswordWorker = new Worker('threadWorkers/targetPasswordWorker.js');
		}else{
			return;
		}

		//pass arguments to web worker
		targetPasswordWorker.postMessage({p:password, e:email});

		//listen to webworker signals
		targetPasswordWorker.onmessage = async function(event) {
			
			//print web worker acknowledgment then terminate it
			targetPasswordWorker.terminate();
			//set it to undefined
			targetPasswordWorker = undefined;
			
			setTimeout(function(){
				//update process status, make alert sound
				shell.beep();
				//call renderer.js function to display resulting patterns
				//>>APP_FOLDER/source/scripts/renderer.js<<
				process_single_password(event.data);

				//now user is free to process again
				bTarget = true;
			},1200);
			//>>APP_FOLDER/source/scripts/alerts.js<<
			process_single_user_alerts(cTarget='singleUserTabID', cTitle='Processing', cClass='singleUserAlerts', cTime=1000);
		};

		//handle exception or error thrown by web worker
		targetPasswordWorker.onerror = function (event) {
			console.log(event.message, event);
			//terminate webworker
			targetPasswordWorker.terminate();
			//set it to undefined
			targetPasswordWorker = undefined;
			//stop progress bar
			document.querySelector("#progressAnimation").style.display = "none";
			//>>APP_FOLDER/source/scripts/alerts.js<<
			analyze_stats_stop_alerts(cTarget='singleUserTabID', cTitle=event.message, cIcon='error', cClass='singleUserAlerts', cTime=2000, cProgress=true);
		};
	}
	document.querySelector("#singleUserSubmit").disabled = false;
}


/**
 * STOP TARGET PASSWORD PROCESS IF REQUIRED
 */
function stop_target_password(){
	//stop loading bar
	document.querySelector("#progressAnimation").style.display = "none";
    if(targetPasswordWorker!=undefined){
        //terminate webworker
		targetPasswordWorker.terminate();
		//set it to undefined
		targetPasswordWorker = undefined;
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='singleUserTabID', cTitle='Stopped', cIcon='warning', cClass='singleUserAlerts');
	}else{
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='singleUserTabID', cTitle='Empty', cIcon='info', cClass='singleUserAlerts');
	}
}


/**
 * FUNCTION TO BLOCK FUNCTIONALITY WHILE PROCESSING DATA IN
 * PROCESS TAB.
 * THIS WILL CHANGE ONCLICK FUNCTIONALITIES OF BUTTON TO SHOW
 * A POP TELLING USER TO WAIT.
 * TO UNBLOCK FUNCTIONALITY AGAIN CALL "unblock_pattern_generation_functionality()"
 */
function block_pattern_generation_functionality(){
	//block single password pattern generation functionality
	document.querySelector("#singleUserButton").style.cursor = "not-allowed";
	document.querySelector("#singleUserButton").onclick = function() {
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='multiUserTabID', cTitle='Wait for process to finish', 
		cIcon='warning', cClass='processStopAlerts', cTime=1500);
		wait_to_process();
	};
	//block target tab
	document.querySelector("#targetTabButton").style.cursor = "not-allowed";
	document.querySelector("#targetTabButton").onclick = function() {
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='multiUserTabID', cTitle='Wait for process to finish', 
		cIcon='warning', cClass='processStopAlerts', cTime=1500);
	};
	//bloc stats generation functionality
	document.querySelector("#changeUserTypes").style.cursor = "not-allowed";
	document.querySelector("#changeUserTypes").onclick = function() {
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='multiUserTabID', cTitle='Wait for process to finish', 
		cIcon='warning', cClass='processStopAlerts', cTime=1500);
	};
	//block database tab
	document.querySelector("#databaseTabButton").style.cursor = "not-allowed";
	document.querySelector("#databaseTabButton").onclick = function() {
		//>>APP_FOLDER/source/scripts/alerts.js<<
		general_stop_alerts(cTarget='multiUserTabID', cTitle='Wait for process to finish', 
		cIcon='warning', cClass='processStopAlerts', cTime=1500);
	};
}

/**
 * FUNCTION TO UNBLOCK FUNCTIONALITIES WHICH ARE BLOCKED BECAUSE 
 * OTHER RESOURCE HEAVY PROCESSES WERE TAKING PALACE.
 * THIS WILL CHANGE ONCLICK FUNCTIONALITIES OF BUTTON TO NORMAL CALLS.
 */
function unblock_pattern_generation_functionality(){
	//block single password pattern generation functionality
	document.querySelector("#singleUserButton").style.cursor = "pointer";
	document.querySelector("#singleUserButton").onclick = function() {
		//>>APP_FOLDER/source/scripts/process.js<<
		open_process_tabs(event, 'singleUserTabID');
	};
	//block target tab
	document.querySelector("#targetTabButton").style.cursor = "pointer";
	document.querySelector("#targetTabButton").onclick = function() {
		//>>APP_FOLDER/source/scripts/tabs.js<<
		change_main_tabs(event, 'targetTab');
	};
	//bloc stats generation functionality
	document.querySelector("#changeUserTypes").style.cursor = "pointer";
	document.querySelector("#changeUserTypes").onclick = function() {
		//>>APP_FOLDER/source/scripts/process.js<<
		change_analyse_to_stats();
	};
	//block database tab
	document.querySelector("#databaseTabButton").style.cursor = "pointer";
	document.querySelector("#databaseTabButton").onclick = function() {
		//>>APP_FOLDER/source/scripts/tabs.js<<
		change_main_tabs(event, 'databaseTab');
	};
}