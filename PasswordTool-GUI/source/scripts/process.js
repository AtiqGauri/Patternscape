function openProcessTabs(evt, tabName) {
    var i, processTabContent, processTabLinks;
    processTabContent = document.getElementsByClassName("processTabContent");
    for (i = 0; i < processTabContent.length; i++) {
        processTabContent[i].style.display = "none";
    }
    processTabLinks = document.getElementsByClassName("processTabLinks");
    for (i = 0; i < processTabLinks.length; i++) {
        processTabLinks[i].className = processTabLinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

function process_thread_selection(){
    var elem = document.querySelector('input[type="range"]');
    var rangeValue = function(){
    var newValue = elem.value;
    var target = document.getElementById("valueLabel");
    target.innerHTML = newValue;
    }
    elem.addEventListener("input", rangeValue);
}

var analyseOrStats = false;
function changeAnalyseToStats(){
    var arrowClass = document.getElementById("changeUserTypes");
    var analyseElement = document.getElementById("processRawData");
    var statElement = document.getElementById("statsGeneration");

    if(analyseOrStats==true){
        analyseOrStats=false;
    }else{
        analyseOrStats= true;
    }

    if(analyseOrStats!=true){
        arrowClass.style.backgroundColor = "#78126A";
        analyseElement.style.display = "block";
        statElement.style.display = "none";
    }else{
        arrowClass.style.backgroundColor = "#E86135";
        statElement.style.display = "block";
        analyseElement.style.display = "none";

    }
}

function process_change_button(){
    document.getElementById("changeUserTypes").onmouseover = function() {
        if(analyseOrStats!=true){
            this.style.backgroundColor = "#E86135";
        }else{
            this.style.backgroundColor = "#78126A";
        }
    }
    document.getElementById("changeUserTypes").onmouseout = function() {
        if(analyseOrStats!=true){
            this.style.backgroundColor = "#78126A";
        }else{
            this.style.backgroundColor = "#E86135";
        }
    }
}

function singleUserForm(){
	targetForm = document.getElementById("singleUserForm");
    // Form is invalid!
    if (!targetForm.checkValidity()) {
        // Create the temporary button, click and remove it
        var tmpSubmit = document.createElement('button');
        targetForm.appendChild(tmpSubmit);
        tmpSubmit.click();
        targetForm.removeChild(tmpSubmit);
    }else{
        catch_target_password();
    }
}

//variable for web workers
var worker1; var worker2; var targetPasswordWorker;
//variables to check worker status
var bAnalyzer = true;
var bTarget = true;


/**********************************************************************************************
 * Analyze process worker functionality
 **********************************************************************************************/
/**
 * Function to call C++ addon api into a separate thread
 * This function will detect patterns out of raw email and passwords
 * check out documentation or c++ code for more information
 */
function analyze_passwords_emails(){
	
	//if process is not executing already
	if(bAnalyzer){
		bAnalyzer = false;

		document.getElementById("progressAnimation").style.display = "block";
		
		if(fs.existsSync(path.join(process.resourcesPath, '..','data','Input'))){
			if(fs.readdirSync(path.join(process.resourcesPath, '..','data','Input')).length <= 1){
				moving_forward_to_stats(cTitle='<b style="color:#5c0e51;">No file available to analyze</b>', 
				cHtml='<b style="margin: 0 4vw 0 1vw;">copy paste files inside "Raw Data" folder, then try again</b>',
				 cIcon='warning', cTime='60000', cConfirmButton=true, cCancelButton=false);
				document.getElementById("progressAnimation").style.display = "none";
				bAnalyzer = true;
				return;
			}
		}else if(fs.existsSync(path.join(__dirname, '..','data','Input'))){
			if(fs.readdirSync(path.join(__dirname, '..','data','Input')).length <= 1){
				moving_forward_to_stats(cTitle='<b style="color:#5c0e51;">No file available to analyze</b>', 
				cHtml='<b style="margin: 0 4vw 0 1vw;">copy paste files inside "Raw Data" folder, then try again</b>',
				 cIcon='warning', cTime='60000', cConfirmButton=true, cCancelButton=false);
				document.getElementById("progressAnimation").style.display = "none";
				bAnalyzer = true;
				return;
			}
		}else{
			console.error('data/Database/ folder doesn\'t exist');
		}

		//initalizing web worker
		if(worker1==undefined){
			worker1 = new Worker('threadWorkers/analyzationWorker.js');
		}else{
			return;
		}
		
		//get user given thread number from GUI
		var threadNumber = document.getElementById('threadSelectorInput').value;
		
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

			document.getElementById("progressAnimation").style.display = "none";
			//This function is defined in renderer.js to list all files in Output folder 
			output_of_analyzing();

			//direct user to generate stats after 4 seconds
			moving_forward_to_stats();
		};

		//handle exception or error thrown by web worker
		worker1.onerror = function (event) {
			console.log(event.message, event);
			document.getElementById("progressAnimation").style.display = "none";
			moving_forward_to_stats(cTitle='<b style="color:#5c0e51;">Error</b>', 
			cHtml='<b style="margin: 0 4vw 0 1vw;">'+ event.message +'</b>',
		 	cIcon='error', cTime='180000');
		};
	}
}

/**
 * stop analyzation process if required
 */
function stop_analyze_passwords_emails(){
	
	document.getElementById("progressAnimation").style.display = "none";
    if(worker1!=undefined){
        //terminate webworker
		worker1.terminate();
        //set it to undefined
		worker1 = undefined;

		//set process status variable
		bAnalyzer = true;
		
		general_stop_alerts(cTarget='processRawData', cTitle='Stopped', cIcon='warning', cClass='processStopAlerts');
	}else{
		general_stop_alerts(cTarget='processRawData', cTitle='Empty', cIcon='info', cClass='processStopAlerts');
	}

}


/**********************************************************************************************
 * statistics process worker functionality
 **********************************************************************************************/
/**
 * Function to call C++ addon api into a separate thread
 * This function will categories all the patterns and their respective datafiles.
 * Then it will store all categorized pattern into a single file with their datafile addresses and popularity.
 */
function generate_statistics(){
	document.getElementById("progressAnimation").style.display = "block";

	if(fs.existsSync(path.join(process.resourcesPath, '..','data','Output'))){
		if(fs.readdirSync(path.join(process.resourcesPath, '..','data','Output')).length <= 1){
			moving_forward_to_stats(cTitle='<b style="color:#5c0e51;">No file available to analyze</b>', 
			cHtml='<b style="margin: 0 4vw 0 1vw;">copy paste files inside "Raw Data" folder, then try again</b>',
			 cIcon='warning', cTime='60000', cConfirmButton=true, cCancelButton=false);
			document.getElementById("progressAnimation").style.display = "none";
			bAnalyzer = true;
			return;
		}
	}else if(fs.existsSync(path.join(__dirname, '..', 'data', 'Output'))){
		if(fs.readdirSync(path.join(__dirname, '..', 'data', 'Output')).length <= 1){
			moving_forward_to_stats(cTitle='<b style="color:#5c0e51;">No file available to analyze</b>', 
			cHtml='<b style="margin: 0 4vw 0 1vw;">copy paste files inside "Raw Data" folder, then try again</b>',
			 cIcon='warning', cTime='60000', cConfirmButton=true, cCancelButton=false);
			document.getElementById("progressAnimation").style.display = "none";
			bAnalyzer = true;
			return;
		}
	}else{
		console.error('data/Database/ folder doesn\'t exist');
	}


	//initalizing web worker
	if(worker2==undefined){
		worker2 = new Worker('threadWorkers/statisticsWorker.js');
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

		document.getElementById("progressAnimation").style.display = "none";
		//This function is defined in renderer.js to list all files in Output folder 
		output_of_stats_generator();

		//direct user to import data window
		moving_forward_to_importDB();
	};

	//handle exception or error thrown by web worker
	worker2.onerror = function (event) {
		console.log(event.message, event);
		document.getElementById("progressAnimation").style.display = "none";
		moving_forward_to_importDB(cTitle='<b style="color:#E86135;">Error</b>', 
		cHtml='<b style="margin: 0 4vw 0 1vw;">'+ event.message +'</b>',
		 cIcon='error', cTime='180000');
	};
}

/**
 * stop stats generation process if required
 */
function stop_generate_statistics(){
	
	document.getElementById("progressAnimation").style.display = "none";
    if(worker2!=undefined){
        //terminate webworker
        worker2.terminate();

        //set it to undefined
		worker2 = undefined;
		general_stop_alerts(cTarget='statsGeneration', cTitle='Stopped', cIcon='warning', cClass='processStopAlerts');
	}else{
		general_stop_alerts(cTarget='statsGeneration', cTitle='Empty', cIcon='info', cClass='processStopAlerts');
	}
}


/**********************************************************************************************
 * single user target worker functionality
 **********************************************************************************************/
/**
 * Function to process a single password and generate/display patterns out of it.
 * @param {string} password patterns are gonna be detected by processing this password 
 * @param {string} email email for the password(optional) (default=*****@*****.com)
 * This uses a web work to process asynchronously.
 * when finished it will call renderer.js file function to display resulting patterns
 */
function target_password_patterns(password, email){	
	//check if same process is not running in background then start this
	if(bTarget){
		//process started in background
		bTarget = false;

		document.getElementById("singleUserSubmit").disabled = true;

		//initalizing web worker
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
				process_single_password(event.data);

				//now user is free to process again
				bTarget = true;
			},1200);
			process_single_user_alerts(cTarget='singleUserTabID', cTitle='Processing', cClass='singleUserAlerts', cTime=1000);
		};

		//handle exception or error thrown by web worker
		targetPasswordWorker.onerror = function (event) {
			console.log(event.message, event);
			document.getElementById("progressAnimation").style.display = "none";
			analyze_stats_stop_alerts(cTarget='singleUserTabID', cTitle=event.message, cIcon='error', cClass='singleUserAlerts', cTime=2000, cProgress=true);
		};
	}
	document.getElementById("singleUserSubmit").disabled = false;
}


/**
 * stop target password process if required
 */
function stop_target_password(){
	document.getElementById("progressAnimation").style.display = "none";
    if(targetPasswordWorker!=undefined){
        //terminate webworker
		targetPasswordWorker.terminate();
		//set it to undefined
		targetPasswordWorker = undefined;
		general_stop_alerts(cTarget='singleUserTabID', cTitle='Stopped', cIcon='warning', cClass='singleUserAlerts');
	}else{
		general_stop_alerts(cTarget='singleUserTabID', cTitle='Empty', cIcon='info', cClass='singleUserAlerts');
	}
}