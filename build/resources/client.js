const h1 = document.querySelector("h1");
console.log('make a worker: ', 'worker1.js')
console.log('make a worker: ', 'worker2.js')
var worker1; var worker2;


function startWork1(){
	worker1 = new Worker('./build/resources/worker1.js')

	worker1.onmessage = function(event) {
		console.log("worker1 : ", event.data);
		worker1.terminate();
		h1.innerHTML = (
			'<p style="text-align:center"> Calculations are completed:'
			+ '</br>' + 'Check root$ data/Output </p>'
		);
	};

	worker1.onerror = function (event) {
        console.log(event.message, event);
	};
}

function startWork2(){
	worker2 = new Worker('./build/resources/worker2.js')

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