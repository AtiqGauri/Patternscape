//require path package to handle file addresses
const path = require('path');
//require file system
const fs = require('fs');
//require n-readlines to read huge file line by line without excessive use of memory 
const lineByLine = require('n-readlines');

//initialize n-readlines with data file address
//double if statement to avoid path error because of asar packaging of electron app
if(fs.existsSync(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns.txt'))){   
    var liner = new lineByLine(path.join(__dirname, '..', '..', '..','data', 'Stats', 'Patterns.txt'));
}else if(fs.existsSync(path.join(__dirname, '..','data', 'Stats', 'Patterns.txt'))){
    var liner = new lineByLine(path.join(__dirname, '..','data', 'Stats', 'Patterns.txt'));
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
    //enter popularity data
    popularity.innerHTML = splitter[2];
    //enter address data
    address.innerHTML = splitter[1];
    
    //append row into table element
    table.appendChild(tr);
}