//variable for web workers
var worker1; var worker2; var targetPasswordWorker;
//variables to check worker status
var bAnalyzer = true;
var bTarget = true;

/**
 * Function to call C++ addon api into a separate thread
 * This function will detect patterns out of raw email and passwords
 * check out documentation or c++ code for more information
 */
function analyze_passwords_emails(){
	
	//if process is not executing already
	if(bAnalyzer){
		bAnalyzer = false;
		
		//reflect that process is started
		document.getElementById('statusAnalyze').innerHTML = ('<p style="color:yellow;">Processing</p>');

		//initalizing web worker
		worker1 = new Worker('threadWorkers/analyzationWorker.js')
		
		//get user given thread number from GUI
		var threadNumber = document.getElementById('analyzeThreads').value;
		
		//pass thread number to web worker
		worker1.postMessage(threadNumber);

		//listen to webworker signals
		worker1.onmessage = function(event) {
			
			//print web worker acknowledgment then terminate it
			console.log("worker1 : ", event.data);
			worker1.terminate();  

			//update process status in GUI and make alert sound
			document.getElementById('statusAnalyze').innerHTML = ('<p style="color:Green;">Completed</p>');
			shell.beep();
			
			//set process status variable
			bAnalyzer = true;

			//This function is defined in renderer.js to list all files in Output folder 
			output_of_analyzing();
		};

		//handle exception or error thrown by web worker
		worker1.onerror = function (event) {
	        console.log(event.message, event);
		};
	}
}

/**
 * stop analyzation process if required
 */
function stop_analyze_passwords_emails(){
	
	//terminate webworker
	worker1.terminate();

	//set it to undefined
	worker1 = undefined;

	//reflect status in GUI
	document.getElementById('statusAnalyze').innerHTML = ('<p style="color:red;">Stopped</p>');
}

/**
 * Function to call C++ addon api into a separate thread
 * This function will categories all the patterns and their respective datafiles.
 * Then it will store all categorized pattern into a single file with their datafile addresses and popularity.
 */
function generate_statistics(){
	
	//reflect that process is started
	document.getElementById('statusStats').innerHTML = ('<p style="color:yellow;">Processing</p>');
	
	//Initialize web worker
	worker2 = new Worker('threadWorkers/statisticsWorker.js')

	//listen to webworker signals
	worker2.onmessage = function(event) {
		
		//print web worker acknowledgment then terminate it
		console.log("worker2 : ", event.data);
		worker2.terminate();

		//update process status in GUI and make alert sound
		document.getElementById('statusStats').innerHTML = ('<p style="color:Green;">Completed</p>');
		shell.beep();

		//This function is defined in renderer.js to list all files in Output folder 
		output_of_stats_generator();
	};

	//handle exception or error thrown by web worker
	worker2.onerror = function (event) {
        console.log(event.message, event);
	};
}

/**
 * stop stats generation process if required
 */
function stop_generate_statistics(){
	
	//terminate webworker
	worker2.terminate();

	//set it to undefined
	worker2 = undefined;

	//reflect status in GUI
	document.getElementById('statusStats').innerHTML = ('<p style="color:red;">Stopped</p>');
}

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

		//reflect that process has started
		document.getElementById("statusPassword").innerHTML = ('<p style="color:yellow;">Processing</p>');

		//Initialize web worker
		targetPasswordWorker = new Worker('threadWorkers/targetPasswordWorker.js');

		//pass arguments to web worker
		targetPasswordWorker.postMessage({p:password, e:email});

		//listen to webworker signals
		targetPasswordWorker.onmessage = async function(event) {
			
			//print web worker acknowledgment then terminate it
			targetPasswordWorker.terminate();

			//update process status in GUI and make alert sound
			document.getElementById("statusPassword").innerHTML = ('<p style="color:Green;">Completed</p>');
			shell.beep();

			//now user is free to process again
			bTarget = true;
			
			//call renderer.js function to display resulting patterns
			process_single_password(event.data);
		};

		//handle exception or error thrown by web worker
		targetPasswordWorker.onerror = function (event) {
			console.log(event.message, event);
		};
	}
}


/**
 * stop target password process if required
 */
function stop_target_password(){
	//terminate webworker
	targetPasswordWorker.terminate();

	//set it to undefined
	targetPasswordWorker = undefined;

	//reflect status in GUI
	document.getElementById('statusPassword').innerHTML = ('<p style="color:red;">Stopped</p>');
}