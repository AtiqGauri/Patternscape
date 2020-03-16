
/**
 * FUNCTION TO TELL PATTERN IS REQUIRED BY TARGET TAB OR HOME TAB
 * STEP 1. USER CLICK ON SELECT PATTERN IN TARGET TAB "fromTargetWindow"
 *         WILL BE SET TO TRUE.
 * STEP 2. NOW IF USER PRESS SUBMIT BUTTON ON HOME TAB THEN SELECTED PATTERN
 *         WILL REFLECT IN TARGET WINDOW AND "fromTargetWindow" CHANGE TO FALSE
 * STEP 3. IF "fromTargetWindow" IS FALSE THEN SUBMIT BUTTON WILL OPEN PATTERN
 *         DATA FILE IN A NEW WINDOW
 */
var fromTargetWindow = false;
function submit_pattern(){
    //show data file of selected window 
    if(!fromTargetWindow){
        console.log("from home");
        //>>APP_FOLDER/scripts/renderer.js<<
        pattern_lookup();
    }else{
        //user clicked on select pattern in target tab
        console.log("from Target");
        if(document.querySelector("#patternSearchInput").value != ''){
            document.querySelector("#getPattern").innerHTML = document.querySelector("#patternSearchInput").value;
        }
        document.querySelector("#targetTabButton").click();
        fromTargetWindow = false;
    }
}

/**
 * FUNCTION TO SET "fromTargetWindow" TO TRUE
 * AND TAKE USER TO HOME SCREEN AND SELECT PATTERN
 */
function get_target_pattern(){
    fromTargetWindow = true;
    document.querySelector("#homeTabButton").click();
    document.querySelector("#patternSearchInput").focus();
}


/**
 * FUNCTION TO CHECK VALIDITY OF TARGET FORM
 * IF FORM IS FILLED CORRECTLY THEN CALL PROCESSING FUNCTION
 */
function submit_target_form () {
    targetForm = document.querySelector("#targetForm");
    // Form is invalid!
    if (!targetForm.checkValidity()) {
        // Create the temporary button, click and remove it
        var tmpSubmit = document.createElement('button');
        targetForm.appendChild(tmpSubmit);
        tmpSubmit.click();
        targetForm.removeChild(tmpSubmit);

    }else{
        //process target user and generate pattern and password suggestions
        //>>APP_FOLDER/scripts/renderer.js<<
        target_user_pattern();
    }
}