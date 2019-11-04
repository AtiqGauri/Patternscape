console.log('make a worker: ', 'worker1.js')
console.log('make a worker: ', 'worker2.js')
var worker1; var worker2;


function startWork1(){
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
		//This function is defined in renderer.js to list all files in Output folder 
		//listOutput();
	};

	worker1.onerror = function (event) {
        console.log(event.message, event);
	};
}

function startWork2(){
	worker2 = new Worker('./worker2.js')

	worker2.onmessage = function(event) {
		console.log("worker2 : ", event.data);
		worker2.terminate();  
	};

	worker2.onerror = function (event) {
        console.log(event.message, event);
	};
}


function stopWork() { 
	if(worker1){
		worker1.terminate();
		worker1 = undefined;
		console.log("worker1: ",worker1);
	}
	if(worker2){
		worker2.terminate();
		worker2 = undefined;
		console.log("worker2: ",worker2);
	}
}