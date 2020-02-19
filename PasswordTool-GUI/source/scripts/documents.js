var backButton;
var frame;

function get_back_button(){
    backButton = document.getElementById("documentBackButton");
}

function show_document1(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/open?id=1Mz1t8SMHS4BnHrtkYlQtT8WRx4q6cx4f";
    document.getElementById("documentsContentContainer").appendChild(frame);
    backButton.style.display = "block";
}

function show_document2(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/open?id=1GRiRnMCJiTEHLmRm5xOjE9azLnACwEVw";
    document.getElementById("documentsContentContainer").appendChild(frame);
    backButton.style.display = "block";
}

function show_document3(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/open?id=1Z1pqc6J2vR_eBht7YAhjZcoDAaXYHIsH";
    document.getElementById("documentsContentContainer").appendChild(frame);
    backButton.style.display = "block";
}

function show_document4(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/open?id=1MqJOxsgZg2UfjK2jFwUT2M7aTcAli-sM";
    document.getElementById("documentsContentContainer").appendChild(frame);
    backButton.style.display = "block";
}

function show_document5(){
    frame = document.createElement('iframe');
    frame.classList.add("documentFrame");
    frame.src = "https://drive.google.com/open?id=1slBybO6r5fui6M6tQ68gKKiPmKqgCgQ4";
    document.getElementById("documentsContentContainer").appendChild(frame);
    backButton.style.display = "block";
}

function close_frame_and_back_button(){
    frame.parentNode.removeChild(frame);
    backButton.style.display = "none";
}