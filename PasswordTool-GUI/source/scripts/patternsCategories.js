//require path package to handle file addresses
const path = require('path');
//require file system
const fs = require('fs');
//require n-readlines to read huge file line by line without excessive use of memory 
const lineByLine = require('n-readlines');

// When document has loaded, initialized
document.onreadystatechange = () => {
    if (document.readyState == "complete") {
        handleWindowControls();
        platformWindowControl();
    }
};


//initialize n-readlines with data file address
//double if statement to avoid path error because of asar packaging of electron app
if(fs.existsSync(path.join(__dirname, '..', '..', '..', '..','data', 'Stats', 'Patterns.txt'))){   
    var liner = new lineByLine(path.join(__dirname, '..', '..', '..', '..','data', 'Stats', 'Patterns.txt'));
}else if(fs.existsSync(path.join(__dirname, '..', '..','data', 'Stats', 'Patterns.txt'))){
    var liner = new lineByLine(path.join(__dirname, '..', '..','data', 'Stats', 'Patterns.txt'));
}else{
    console.error('data/Stats/Pattern.txt file doesn\'t exist');
}


//variable to denote single line string
let line;
//splitter will be used to split string in tokens
var splitter;

//get table element to add rows in it
var table = document.getElementById('patternTable'), tr;

//loop to iterate in a file
while(line = liner.next()){

    //get table row element
    tr = document.createElement('tr');

    //split lines into tokens
    splitter = line.toString().split('<|>');

    //create a pattern cell
    pattern = document.createElement('td');
    //create a popularity cell
    popularity = document.createElement('td');
    //create a address cell
    address = document.createElement('td');
    
    //append pattern cell into row
    tr.appendChild(pattern);
    //append popularity cell into row
    tr.appendChild(popularity);
    //append address cell into row
    tr.appendChild(address);

    //enter pattern data
    pattern.innerHTML = splitter[0];
    pattern.style.color = '#B94955';
    //enter popularity data
    popularity.innerHTML = splitter[2];
    popularity.style.color = '#5A81AE';
    //enter address data
    address.innerHTML = splitter[1];
    address.style.color = '#f9a825';
    
    //append row into table element
    table.appendChild(tr);
}

function handleWindowControls() {

	let win = require('electron').remote.getCurrentWindow();
	
    // Make minimize/maximize/restore/close buttons work when they are clicked
    document.getElementById('minWindowDiv').addEventListener("click", event => {
        win.minimize();
    });

    document.getElementById('maxWindowDiv').addEventListener("click", event => {
        win.maximize();
    });

    document.getElementById('restoreWindowDiv').addEventListener("click", event => {
        win.unmaximize();
    });

    document.getElementById('closeWindowDiv').addEventListener("click", event => {
        win.close();
    });

    function toggleMaxRestoreButtons() {
        if (win.isMaximized()) {
			//document.body.classList.add('maximized');
			document.getElementById('maxWindowDiv').style.display = 'none';
			document.getElementById('restoreWindowDiv').style.display = 'block';
        } else {
			//document.body.classList.remove('maximized');
			document.getElementById('maxWindowDiv').style.display = 'block';
			document.getElementById('restoreWindowDiv').style.display = 'none';
        }
    }

    // Toggle maximize/restore buttons when maximization/unmaximization occurs
    toggleMaxRestoreButtons();
    win.on('maximize', toggleMaxRestoreButtons);
    win.on('unmaximize', toggleMaxRestoreButtons);
}


function platformWindowControl(){
    if(process.platform == 'darwin'){
        document.getElementById("windowControls").classList.add("forMac");
    }else{
        document.getElementById("windowControls").classList.add("forElse");
    }
}