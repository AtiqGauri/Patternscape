//to communicate with parent window
//const require = parent.require;
const ipc = require('electron').ipcRenderer;

// When document has loaded, initialized
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};


//require h1 element to reflect password 
var h1 = document.getElementById('passwordString');
//require ordered list to add pattern rows
var olContainer = document.getElementById('generatedPatterns');
//required variables
var li, ul, dt, dd, patternTagCounter, i, j, splitter;

//catch detected pattern in passed password
ipc.on('message', (event, data) => {
    //look at data in console to understand while loop working
    console.log(data);

    //split data into tokens
    splitter = data.toString().split('<|>');
    
    //initialize while loop to iterate over data
    i=0;
    //-1 to escape last empty token in splitter
    while(i<(splitter.length-1)){
        
        //create list for next pattern and its data
        li = document.createElement('li');
        //reflect current pattern as a list element
        li.innerHTML = 'Pattern: ' + splitter[i];
        //count number slash in pattern to get number of value that pattern has
        patternTagCounter = (splitter[i].match(/\//g)).length;
        //increase i to password
        i++;

        //reflect password
        h1.innerHTML = 'Password: ' + splitter[i];
        
        //append current pattern as list element to main ordered list
        olContainer.appendChild(li);

        //increase i to first value of current pattern
        i++;

        //create a ul element to contain all values and data of current pattern as its child
        ul = document.createElement('ul');
        li.appendChild(ul);
        
        //loop to iterate over all value of current pattern
        for(j=0; j<patternTagCounter; j++){
            //create dt element to reflect values of current pattern
            dt = document.createElement('dt');
            //reflect dt value
            dt.innerHTML = splitter[i];
            ul.appendChild(dt);
            //increase i to data associated with above value
            i++;

            //create dd element to reflect data associated with value
            dd = document.createElement('dd');
            //reflect dd data
            dd.innerHTML = splitter[i];
            ul.appendChild(dd);
            //increase i to next value of current pattern
            i++;
        }
        //next pattern
    }


})


function handleWindowControls() {

	let targetWin = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.getElementById('minWindowDiv').addEventListener("click", event => {
        targetWin.minimize();
    });

    document.getElementById('maxWindowDiv').addEventListener("click", event => {
        targetWin.maximize();
        document.getElementById('maxWindowDiv').style.display = 'none';
		document.getElementById('restoreWindowDiv').style.display = 'block';
    });

    document.getElementById('restoreWindowDiv').addEventListener("click", event => {
        targetWin.unmaximize();
        document.getElementById('maxWindowDiv').style.display = 'block';
		document.getElementById('restoreWindowDiv').style.display = 'none';
    });

    document.getElementById('closeWindowDiv').addEventListener("click", event => {
        targetWin.close();
    });

    window.onbeforeunload = (e) => {
        targetWin.removeAllListeners();
    };
    targetWin.on('focus', ()=>{
        document.getElementById("minWindowDiv").style.backgroundColor = '#FFBD44';
        document.getElementById("maxWindowDiv").style.backgroundColor = '#00CA4E';
        document.getElementById("restoreWindowDiv").style.backgroundColor = '#00CA4E';
        document.getElementById("closeWindowDiv").style.backgroundColor = '#FF605C';
    });
    targetWin.on('blur', ()=>{
        document.getElementById("minWindowDiv").style.backgroundColor = '#D3D3D3';
        document.getElementById("maxWindowDiv").style.backgroundColor = '#D3D3D3';
        document.getElementById("restoreWindowDiv").style.backgroundColor = '#D3D3D3';
        document.getElementById("closeWindowDiv").style.backgroundColor = '#D3D3D3';
    });
}


function platformWindowControl(){
    document.getElementById("windowControls").style.visibility = 'visible';
    if(process.platform == 'darwin'){
        document.getElementById("windowControls").classList.add("forMac");
        document.getElementById("minWindowDiv").style.order = '2';
        document.getElementById("maxWindowDiv").style.order = '3';
        document.getElementById("restoreWindowDiv").style.order = '3';
        document.getElementById("closeWindowDiv").style.order = '1';
    }else{
        document.getElementById("windowControls").classList.add("forElse");
    }
}