//BACK BUTTON TO CLOSE DOCUMENT WEBVIEW
var backButton;
//WEBVIEW CONTAINER
var webview;

// GET BACK BUTTON REFERENCE ONCE IT GETS LOADED IN DOM
function get_back_button(){
    backButton = document.querySelector("#documentBackButton");
}

/**
 * NEW USER DOCUMENT
 */
function show_document1(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://www.notion.so/atiqgauri/New-User-a4f3448686724c5c9dcd0d91fe88817d";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PATTERNSCAPE WIKI
 */
function show_document2(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://www.notion.so/atiqgauri/Patternscape-46cee07f3f6443628655cc1f48ca1e07";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PATTERNSCAPE USER GUIDES
 */
function show_document3(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://www.notion.so/atiqgauri/User-Guides-c5e2f377a55448fba0dbc5aeb3ee7374";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PATTERNSCAPE CODE DOCUMENTS
 */
function show_document4(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://www.notion.so/atiqgauri/Documentation-432add2c655d4ef2b58e6e275fb06369";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PATTERNSCAPE DEVELOPMENT DOCUMENTS
 */
function show_document5(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://www.notion.so/atiqgauri/Development-43cccfc464f94f51b8f5d5a39058ccfb";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}


/**
 *  PATTERNSCAPE CHANGELOG DOCUMENT
 */
function show_document6(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://www.notion.so/atiqgauri/Patternscape-Changelog-efe215fa53aa4412aef4439753ae52cd";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}


/**
 * FUNCTION TO CLOSE WEBVIEW
 */
function close_frame_and_back_button(){
    webview.parentNode.removeChild(webview);
    backButton.style.display = "none";
}