var backButton;
var webview;

function get_back_button(){
    backButton = document.getElementById("documentBackButton");
}

function show_document1(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/Projects-Timeline--Au_uNAbosZspAZq20qN7JwJwAQ-BoYhgTkFCHQ91an0uF9eg";
    document.getElementById("documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

function show_document2(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/PasswordTool--Au~PAqfJxsR1WhC4wjI7Wcf0AQ-3zHDe81rsqDHR0Ukq5QgY";
    document.getElementById("documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

function show_document3(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/C-Standalone-Application-XIYcE37iG0GRxuEQ1Sx5H?_tk=share_copylink";
    document.getElementById("documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

function show_document4(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/Node.js-Native-Addon-Multithreaded-C--Au8EfYeDbcOfM00hKENSH4iTAQ-cFkQqARLDY2VQZe85fYWc";
    document.getElementById("documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

function show_document5(){
    webview = document.createElement('webview');
    webview.classList.add("documentFrame");
    webview.src = "https://paper.dropbox.com/doc/C-GUI-using-Electron-Multi-threaded-using-Web-Workers--Au96bjWvIWRuY0fZxjTSwTrGAQ-lYArGJfO2KSWVPLSUMBK9";
    document.getElementById("documentsContentContainer").appendChild(webview);
    backButton.style.display = "block";
}

function close_frame_and_back_button(){
    webview.parentNode.removeChild(webview);
    backButton.style.display = "none";
}