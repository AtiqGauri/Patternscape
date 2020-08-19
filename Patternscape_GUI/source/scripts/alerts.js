const alertComponent = require('sweetalert2');

/*****************TARGET STARTS***********************/
function target_alerts(cTarget, cTitle, cClass, cTime=2000){
    alertComponent.fire({
        title: cTitle,
        target: document.querySelector('#'+cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: 'var(--mainTheme-color)',
        showConfirmButton: false,
        toast: true,
        timer: cTime,
        onBeforeOpen: () => {
            alertComponent.showLoading()
        },
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        }
    });
}
/*****************TARGET END***********************/

/*****************HOME STARTS**********************/
function home_pattern_error(cTitle='<b style="width:10vw; margin-right:1vw;"> Invalid pattern</b>', cHtml='<b>Start typing with E, N, M, D, C, L, U to get autocomplete suggestions<b>', cIcon='error'){
    alertComponent.fire({
        title: cTitle,
        target: document.querySelector('#homeTab'),
        html: cHtml,
        customClass: 'centerErrorAlert',
        position: 'center',
        background: 'var(--mainTheme-color)',
        icon: cIcon,
        showConfirmButton: false,
        toast: true,
        timer: 4000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        }
    });
}
/*****************HOME ENDS***********************/

/*****************PROCESS STARTS***********************/

//Output folder function is defined in //>>APP_FOLDER/source/scripts/renderer.js<<
function moving_forward_to_stats(cTitle='<b style="color:var(--processAnalyze-text); user-select:none;">Finished</b>', 
cHtml='<b style="margin: 0 4vw 0 1vw; user-select: none;">Let\'s move to create statistics of analyzed data</b></br>'+
       '<button class="analyzeAlertOutput" onclick="output_of_analyzing()">Output folder</button>',
 cIcon='success', cTime='4000', cConfirmButton=true, cCancelButton=true){
    alertComponent.fire({
        target: document.querySelector('#processTab'),
        title: cTitle,
        html: cHtml,
        padding: '2vh 4vh 2vh 4vh',
        customClass: 'processAnalyzeAlert',
        position: 'top',
        background: 'var(--mainTheme-color)',
        icon: cIcon,
        focusCancel: true,
        showConfirmButton: cConfirmButton,
        confirmButtonText: 'Stay Here',
        confirmButtonColor: 'grey',
        showCancelButton: cCancelButton,
        cancelButtonText: 'Move Forward',
        cancelButtonColor: 'var(--processAnalyze-text)',
        timer: cTime,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        },
    }).then((result) => {
        if (result.value) {
            alertComponent.close();
        }if(!result.value){
            //direct user to generate stats after 2 seconds
            document.querySelector("#changeUserTypes").click();
        }
    });
}

//Output folder is defined in //>>APP_FOLDER/source/scripts/renderer.js<<
function moving_forward_to_importDB(cTitle='<b style="color:var(--processStats-text); user-select:none;">Finished</b>', 
cHtml='<b style="margin:0 4vw 0 1vw; user-select:none;">Now import these statistics into database</b></br>'+
'<button class="statsAlertOutput" onclick="output_of_stats_generator()">Output folder</button>',
 cIcon='success', cTime='240000', cConfirmButton=true, cCancelButton=true){
    alertComponent.fire({
        target: document.querySelector('#statsGeneration'),
        title: cTitle,
        html: cHtml,
        padding: '2vh 4vh 2vh 4vh',
        customClass: 'processStatsAlert',
        position: 'top',
        background: 'var(--mainTheme-color)',
        icon: cIcon,
        focusCancel: true,
        showConfirmButton: cConfirmButton,
        confirmButtonText: 'Stay Here',
        confirmButtonColor: 'grey',
        showCancelButton: cCancelButton,
        cancelButtonText: 'Let\'s Import',
        cancelButtonColor: 'var(--processStats-text)',
        timer: cTime,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        },
    }).then((result) => {
        if (result.value) {
            alertComponent.close();
        }if(!result.value){
            document.querySelector("#databaseTabButton").click();
			document.querySelector("#impDB").click();
        }
    });
}

function general_stop_alerts(cTarget, cTitle, cIcon, cClass, cTime=600, cProgress=false){
    alertComponent.fire({
        title: cTitle,
        target: document.querySelector('#'+cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: 'var(--mainTheme-color)',
        icon: cIcon,
        showConfirmButton: false,
        toast: true,
        timerProgressBar: cProgress,
        timer: cTime,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        }
    });
}

function process_single_user_alerts(cTarget, cTitle, cClass, cTime=2000){
    alertComponent.fire({
        title: cTitle,
        target: document.querySelector('#' + cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: 'var(--mainTheme-color)',
        showConfirmButton: false,
        toast: true,
        timer: cTime,
        onBeforeOpen: () => {
            alertComponent.showLoading()
        },
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        }
    });
}
/*****************PROCESS ENDS***********************/

/*****************DATABASE STARTS***********************/
function database_acknowledgment(cTarget='importDB', cTitle='Imported Successfully', cIcon='success', cClass='databaseImportAlert', cResult='importDbResult', cTime=2000){
    alertComponent.fire({
        title: cTitle,
        target: document.querySelector('#'+cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: 'var(--mainTheme-color)',
        icon: cIcon,
        showConfirmButton: false,
        toast: true,
        timer: cTime,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        }
    }).then(() => {
        document.querySelector('#'+cResult).style.display = "block";
    });
}

function database_error_alerts(cTarget, cTitle, cHtml, cIcon, cClass, cTime, cBColor){
    alertComponent.fire({
        target: document.querySelector('#'+cTarget),
        title: cTitle,
        html: cHtml,
        padding: '2vh 4vh 2vh 4vh',
        customClass: cClass,
        position: 'center',
        background: 'var(--mainTheme-color)',
        icon: cIcon,
        focusCancel: true,
        showConfirmButton: true,
        confirmButtonText: 'Okay',
        confirmButtonColor: cBColor,
        timer: cTime,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        },
    }).then((result) => {
        if (result.value) {
            alertComponent.close();
        }
    });
}
/*****************DATABASE ENDS***********************/

module.exports = {
    home_pattern_error,
    moving_forward_to_stats,
    moving_forward_to_importDB,
    general_stop_alerts,
    process_single_user_alerts,
    database_acknowledgment,
    database_error_alerts,
}