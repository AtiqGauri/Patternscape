var backButton;
var frame;

function get_back_button(){
    backButton = document.getElementById("documentBackButton");
}

function show_document1(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/file/d/1gWjTW6tEVYis6erLceJoNPuVmvvN6kCh/preview";
    document.getElementById("documentsContentContainer").appendChild(frame);
    console.log('iframe.contentWindow =');
    backButton.style.display = "block";
}

function show_document2(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/file/d/1GRiRnMCJiTEHLmRm5xOjE9azLnACwEVw/view?usp=sharing";
    document.getElementById("documentsContentContainer").appendChild(frame);
    console.log('iframe.contentWindow =');
    backButton.style.display = "block";
}

function show_document3(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/file/d/1gWjTW6tEVYis6erLceJoNPuVmvvN6kCh/preview";
    document.getElementById("documentsContentContainer").appendChild(frame);
    console.log('iframe.contentWindow =');
    backButton.style.display = "block";
}

function close_frame_and_back_button(){
    frame.parentNode.removeChild(frame);
    backButton.style.display = "none";
}