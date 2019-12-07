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
		worker1 = new Worker('./worker1.js')
		
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
	worker2 = new Worker('./worker2.js')

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


function target_password_patterns(){
	if(bTarget){
		bTarget = false;

		var password = document.getElementById("targetPasswordInput").value;
		var email = document.getElementById("targetEmailBar").value;

		if(password==''){
			document.getElementById("statusPassword").innerHTML = ('<p style="color:red;">* Complete Required Fields</p>');
			bTarget = true;
			return;
		}
		if(email == ''){
			email = "";
		}

		document.getElementById("statusPassword").innerHTML = ('<p style="color:yellow;">Processing</p>');

		//Initialize web worker
		targetPasswordWorker = new Worker('targetPasswordWorker.js');

		targetPasswordWorker.postMessage({p:password, e:email});

		//listen to webworker signals
		targetPasswordWorker.onmessage = async function(event) {
			
			//print web worker acknowledgment then terminate it
			targetPasswordWorker.terminate();

			//update process status in GUI and make alert sound
			document.getElementById("statusPassword").innerHTML = ('<p style="color:Green;">Completed</p>');
			shell.beep();

			bTarget = true;
			//console.log(detectedData);
			process_single_password(event.data);
		};

		//handle exception or error thrown by web worker
		targetPasswordWorker.onerror = function (event) {
			console.log(event.message, event);
		};
	}
}

function stop_target_password(){
	//terminate webworker
	targetPasswordWorker.terminate();

	//set it to undefined
	targetPasswordWorker = undefined;

	//reflect status in GUI
	document.getElementById('statusPassword').innerHTML = ('<p style="color:red;">Stopped</p>');
}