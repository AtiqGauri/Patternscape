function openOperations(evt, tabName) {
    var i, dbTabContent, dbTabLinks;
    dbTabContent = document.getElementsByClassName("dbTabContent");
    for (i = 0; i < dbTabContent.length; i++) {
        dbTabContent[i].style.display = "none";
    }
    dbTabLinks = document.getElementsByClassName("dbTabLinks");
    for (i = 0; i < dbTabLinks.length; i++) {
        dbTabLinks[i].className = dbTabLinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    document.getElementById(tabName).style.transition = "10s";
    evt.currentTarget.className += " active";
}

function databaseDeleteCheckbox() {
  var element = document.getElementById("deleteIconWrapperID");
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

function persistDatabase(){
  var element = document.getElementById("persistDataButton");

  element.style.backgroundColor = "#4CBB17"
  element.style.color = "white";
}