console.log('make a worker: ', 'worker1.js')
console.log('make a worker: ', 'worker2.js')
var worker1; var worker2;
var bAnalyzer = true;


function analyze_passwords_emails(){
	if(bAnalyzer){
		bAnalyzer = false;
		worker1 = new Worker('./worker1.js')
		
		var threadNumber = document.getElementById('analyzeThreads').value;

		if(threadNumber>=2){
			worker1.postMessage(threadNumber);
		}else{
			threadNumber = 2;
			worker1.postMessage(threadNumber);
		}

		worker1.onmessage = function(event) {
			console.log("worker1 : ", event.data);
			worker1.terminate();  
			document.getElementById('statusAnalyze').innerHTML = ('Completed');
			shell.beep();
			bAnalyzer = true;
			//This function is defined in renderer.js to list all files in Output folder 
			output_of_anlyzing();
		};

		worker1.onerror = function (event) {
	        console.log(event.message, event);
		};
	}
}

function stop_analyze_passwords_emails(){
	worker1.terminate();
	worker1 = undefined;
	document.getElementById('statusAnalyze').innerHTML = ('Stopped');
}

function generate_statistics(){
	worker2 = new Worker('./worker2.js')

	worker2.onmessage = function(event) {
		console.log("worker2 : ", event.data);
		worker2.terminate();
		document.getElementById('statusStats').innerHTML = ('Completed');
		shell.beep();
		//This function is defined in renderer.js to list all files in Output folder 
		output_of_stats_generator();
	};

	worker2.onerror = function (event) {
        console.log(event.message, event);
	};
}

function stop_generate_statistics(){
	worker2.terminate();
	worker2 = undefined;
	document.getElementById('statusStats').innerHTML = ('Stopped');
}