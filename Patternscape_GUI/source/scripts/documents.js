//BACK BUTTON TO CLOSE DOCUMENT WEBVIEW
var backButton;
//WEBVIEW CONTAINER
var webview;

// GET BACK BUTTON REFERENCE ONCE IT GETS LOADED IN DOM
function get_back_button(){
    backButton = document.querySelector("#documentBackButton");
}

/**
 * PROJECT TIME-LINE/ROADMAP DOCUMENT 
 */
function show_document1(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/Projects-Timeline--Au_uNAbosZspAZq20qN7JwJwAQ-BoYhgTkFCHQ91an0uF9eg";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PROJECT MAIN DOCUMENT 
 */
function show_document2(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/Patternscape--Au~PAqfJxsR1WhC4wjI7Wcf0AQ-3zHDe81rsqDHR0Ukq5QgY";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PROJECT LAYER 1 DOCUMENT (C++ BACKEND)
 */
function show_document3(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/C-Standalone-Application-XIYcE37iG0GRxuEQ1Sx5H?_tk=share_copylink";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PROJECT LAYER 1.5 DOCUMENT (NODE-ADDON-API) 
 */
function show_document4(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/Node.js-Native-Addon-Multithreaded-C--Au8EfYeDbcOfM00hKENSH4iTAQ-cFkQqARLDY2VQZe85fYWc";
    document.querySelector("#documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

/**
 * PROJECT LAYER 2 DOCUMENT (GUI) 
 */
function show_document5(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/C-GUI-using-Electron-Multi-threaded-using-Web-Workers--Au96bjWvIWRuY0fZxjTSwTrGAQ-lYArGJfO2KSWVPLSUMBK9";
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