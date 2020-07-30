//IMPORT FUNCTION TO GET MATCHING PATTERNS
const { starts_with_ignore_case } = require('./scripts/databaseInit.js');
//REQUIRE DATABASE IMPORT EXPORT SCRIPT 
var importExportDB = require("./scripts/importExportDatabase.js");
//const { homePatternError } = require('./scripts/alerts.js');

/**
 * FUNCTION TO SUGGEST AUTOCOMPLETE PATTERNS
 * THIS WILL MAKE DATABASE QUERY EVERY TIME USER TYPES A LETTER IN SEARCH BAR
 * @param {input element} inp SEARCH BAR INPUT REFERENCE
 * # IF DATABASE IS EMPTY THEN THROW A WARNING
 * # IF USER TYPES A WRONG LETTER THEN THROW A WARNING
 */
function autocomplete(inp) {

    var currentFocus;
    //when input bar is focused
    inp.addEventListener("focus", function(e) {
        setTimeout(() => { this.parentNode.setAttribute("class", "searchBarContainer focused") }, 200);
    });
    //when input bar is unfocused
    inp.addEventListener("blur", function(e) {
        setTimeout(() => { this.parentNode.setAttribute("class", "searchBarContainer") }, 200);
    });


    //execute a function when someone writes in the text field:
    inp.addEventListener("input", function(e) {
        
        var a, b, i, val = this.value;
        
        //close any already open lists of autocompleted values
        closeAllLists();
        
        if (!val) { return false;}
        currentFocus = -1;
        
        //create a DIV element that will contain the items (values):
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");
        
        //append the DIV element as a child of the autocomplete container:
        this.parentNode.appendChild(a);
        
        //array to store results found in database
        var dbArray = [];
        
        //make call to database
        starts_with_ignore_case(val).then(function(result) {
            dbArray = result.slice(0,14);
            //if database is empty
            if(dbArray.length==0){
                //check is there is any record in database
                //>>APP_FOLDER/source/scripts/importExportDatabase.js<<
                importExportDB.get_database_count().then(function(total) {
                    //throw a warning saying database is empty
                    if(total==0){
                        //>>APP_FOLDER/source/scripts/alerts.js<<
                        home_pattern_error(cTitle='<b style="width:10vw; margin-right:1vw;"> Empty Database</b>', cHtml='<b>No pattern available to suggest<b>', cIcon='warning');
                        document.querySelector("#patternSearchInput").value = "";
                    }else{
                        //throw a warning saying user typed wrong letter
                        //>>APP_FOLDER/source/scripts/alerts.js<<
                        home_pattern_error(cTitle='<b style="width:10vw; margin-right:1vw;"> Invalid pattern</b>', cHtml='<b>Start typing with E, N, M, D, C, L, U to get autocomplete suggestions<b>', cIcon='error');
                        document.querySelector("#patternSearchInput").value = "";        
                    }
                });
                return;
            }else{
                alertComponent.close();
            }
            //iterate over matching patterns 
            for (i = 0; i < dbArray.length; i++) {
                
                //create a DIV element for each matching element:
                b = document.createElement("DIV");
                
                //make the matching letters bold:
                b.innerHTML ="<strong>" + dbArray[i].pattern.substr(0, val.length) +"</strong>" 
                + dbArray[i].pattern.substr(val.length);
                //add popularity with pattern name
                b.innerHTML += "<b id=\"searchPatternPopularity\">" +dbArray[i].popularity + "</b>";

                //insert a input field that will hold the current array item's value:
                b.innerHTML += "<input type='hidden' value='" + dbArray[i].pattern + "'>";
                
                //execute a function when someone clicks on the item value (DIV element):
                b.addEventListener("click", function(e) {
                    
                    //insert the value for the autocomplete text field:
                    inp.value = this.getElementsByTagName("input")[0].value;
                    
                    //close the list of autocompleted values,
                    //or any other open lists of autocompleted values:
                    closeAllLists();
                });
                a.appendChild(b);
            }
        });
    });
    //execute a function presses a key on the keyboard:
    inp.addEventListener("keydown", function(e) {
        var x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            //If the arrow DOWN key is pressed,
            //increase the currentFocus variable:
            currentFocus++;
           
            //and and make the current item more visible:
            addActive(x);

        } else if (e.keyCode == 38) { //up
            
            //If the arrow UP key is pressed,
            //decrease the currentFocus variable:
            currentFocus--;

            //and and make the current item more visible:
            addActive(x);
        
        } else if (e.keyCode == 13) {
            
            //If the ENTER key is pressed, prevent the form from being submitted,
            e.preventDefault();
            if (currentFocus > -1) {
            //and simulate a click on the "active" item:
            if (x) x[currentFocus].click();
            }
            document.querySelector("#homeSubmit").click();
        }
    });
    function addActive(x) {
        
        //a function to classify an item as "active":
        if (!x) return false;
        
        //start by removing the "active" class on all items:
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);

        //add class "autocomplete-active":
        x[currentFocus].classList.add("autocomplete-active");
    }
    function removeActive(x) {
        
        //a function to remove the "active" class from all autocomplete items:
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }
    function closeAllLists(element) {

        //close all autocomplete lists in the document,
        //except the one passed as an argument:
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (element != x[i] && element != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    //execute a function when someone clicks in the document:
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

//initiate the autocomplete function
//autocomplete(document.getElementById("patternBar"));



/**
 * FUNCTION TO CHANGE APP THEME BETWEEN DARK AND LIGHT
 * 1. FIST CHECK WHAT IS USER PREFERENCE IN DATABASE
 * 2. IF DARK THEN CHANGE PREFERENCE TO LIGHT AND VICE VERSA 
 * 3. CALL SET THEME FUNCTION TO CHANGE THEME.
 */
function change_app_theme() {
    if(window.localStorage.user_theme == 'dark'){
        window.localStorage.user_theme = 'light';
        //>>source/renderer.js<<
        set_app_theme();
    }else{
        window.localStorage.user_theme = 'dark';
        //>>source/renderer.js<<
        set_app_theme();
    }
}