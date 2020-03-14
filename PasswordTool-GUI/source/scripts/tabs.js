/**
 * FUNCTION TO CHANGE MAIN TABS WHEN CLICKED
 * FIRST IT WILL FIRST SET "display:none" TO ALL TABS
 * THEN IT WILL SET "display:block" ON SELECTED TAB
 * @param {event} evt ELEMENT REFERENCE 
 * @param {id} tabName SUB-TAB ID WHICH WILL BE DISPLAYED 
 */
function change_main_tabs(evt, tabName){
    var i, tabContent, tabLinks;
    tabContent = document.getElementsByClassName("tabContent");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }
    tabLinks = document.getElementsByClassName("tabLinks");
    for (i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
    }
    document.querySelector('#'+tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

//CLICK ON HOME TAB AS ACTIVE TAB WHEN APP IS STARTED
document.querySelector("#homeTabButton").click();