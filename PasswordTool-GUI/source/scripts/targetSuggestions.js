//to communicate with parent window
const ipc = require('electron').ipcRenderer; 

//get ordered list element to append suggestion rows into it
var olContainer = document.getElementById('suggestionList'), li;

//Catch suggestion array sent by parent window
ipc.on('message', (event, suggestionArray) => {

    //iterate over suggestion array
    suggestionArray.forEach(function (suggestion) {

        //create a list element
        li = document.createElement('li');
        //append list element to main suggestions list
        olContainer.appendChild(li);       
        
        //create a dt element, this will represent suggested pattern
        dt = document.createElement('dt');
        dt.innerHTML = suggestion.original;
        //append it to current row(list element)
        li.appendChild(dt);

        //create a dd element, this will represent processed pattern
        dd = document.createElement('dd');
        dd.innerHTML = suggestion.generated;
        //append it to current row(list element)
        li.appendChild(dd);

    });

})