/**
 * FUNCTION TO CHANGE SUB-TABS OF DATABASE TAB
 * THIS WILL ASSIGN "display:none" TO ALL TAB AND THEN
 * "tabName" TAB WILL ASSIGNED TO "display:block"
 * @param {event} evt GET REFERENCE OF ELEMENT WHICH TRIGGERED THE FUNCTION 
 * @param {*} tabName TAB WHICH WILL BE DISPLAYED
 */
function open_operations(evt, tabName) {
    var i, dbTabContent, dbTabLinks;
    dbTabContent = document.getElementsByClassName("dbTabContent");
    for (i = 0; i < dbTabContent.length; i++) {
        dbTabContent[i].style.display = "none";
    }
    dbTabLinks = document.getElementsByClassName("dbTabLinks");
    for (i = 0; i < dbTabLinks.length; i++) {
        dbTabLinks[i].className = dbTabLinks[i].className.replace(" active", "");
    }
    document.querySelector('#'+tabName).style.display = "block";
    document.querySelector('#'+tabName).style.transition = "10s";
    evt.currentTarget.className += " active";
}

/**
 * FUNCTION TO TOGGLE CHECKBOX OF DATABASE DELETE BUTTON
 * CHECKBOX MUST BE ACTIVE IN ORDER TO DELETE DATABASE
 */
function database_delete_checkbox() {
  var element = document.querySelector("#deleteIconWrapperID");
  if (element.classList) { 
    element.classList.toggle("deleteIconActive");
    
  } else {
    var classes = element.className.split(" ");
    var i = classes.indexOf("deleteIconActive");

    if (i >= 0) 
      classes.splice(i, 1);
    else 
      classes.push("deleteIconActive");
      element.className = classes.join(" "); 
  }
}

/**
 * FUNCTION TO CHANGE COLOR OF DATABASE PERSISTANCE BUTTON
 * THIS WILL CHANGE COLOR OF BUTTON WHEN IT IS ACTIVEs
 */
function persist_database_color(){
  var element = document.querySelector("#persistDataButton");

  element.style.backgroundColor = "var(--christi-green)"
  element.style.color = "var(--mainTheme-color)";
  element.style.textShadow = "none";
  element.style.fontWeight = "bolder";
}