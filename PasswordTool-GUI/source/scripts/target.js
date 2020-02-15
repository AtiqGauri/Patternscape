var fromTargetWindow = false;
function submitPattern(){
    if(!fromTargetWindow){
        console.log("from home");
        pattern_lookup();
    }else{
        console.log("from Target");
        if(document.getElementById("patternSearchInput").value != ''){
            document.getElementById("getPattern").innerHTML = document.getElementById("patternSearchInput").value;
        }
        document.getElementById("targetTabButton").click();
        fromTargetWindow = false;
    }
}
function getTargetPattern(){
    fromTargetWindow = true;
    document.getElementById("homeTabButton").click();
    document.getElementById("patternSearchInput").focus();
}



function submitTargetForm () {
    targetForm = document.getElementById("targetForm");
    // Form is invalid!
    if (!targetForm.checkValidity()) {
        // Create the temporary button, click and remove it
        var tmpSubmit = document.createElement('button');
        targetForm.appendChild(tmpSubmit);
        tmpSubmit.click();
        targetForm.removeChild(tmpSubmit);

    }else{
        target_user_pattern();
    }
}