//to communicate with parent window
const require = parent.require;
const ipc = require('electron').ipcRenderer;

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