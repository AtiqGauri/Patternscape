const alertComponent = require('sweetalert2');

/*****************TARGET STARTS***********************/
function target_alerts(cTarget, cTitle, cClass, cTime=2000){
    alertComponent.fire({
        title: cTitle,
        target: document.getElementById(cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: '#F2F2F2',
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

/*****************HOME STARTS***********************/
function home_pattern_error(cTitle='<b style="width:10vw; margin-right:1vw;"> Invalid pattern</b>', cIcon='error'){
    alertComponent.fire({
        title: cTitle,
        target: document.getElementById('homeTab'),
        html: '<b>Start typing with E, N, M, D, C, L, U to get autocomplete suggestions<b>',
        customClass: 'centerErrorAlert',
        position: 'center',
        background: '#F2F2F2',
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
function moving_forward_to_stats(cTitle='<b style="color:#5c0e51;">Finished</b>', 
cHtml='<b style="margin: 0 4vw 0 1vw;">Let\'s move to create statistics</b>',
 cIcon='success', cTime='4000'){

    alertComponent.fire({
        target: document.getElementById('processTab'),
        title: cTitle,
        html: cHtml,
        padding: '2vh 4vh 2vh 4vh',
        customClass: 'processAnalyzeAlert',
        position: 'top',
        background: '#F2F2F2',
        icon: cIcon,
        focusCancel: true,
        showConfirmButton: true,
        confirmButtonText: 'Stay Here',
        confirmButtonColor: 'grey',
        showCancelButton: true,
        cancelButtonText: 'Move Forward',
        cancelButtonColor: '#78126A',
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
            document.getElementById("changeUserTypes").click();
        }
    });
}

function moving_forward_to_importDB(cTitle='<b style="color:#E86135;">Finished</b>', 
cHtml='<b style="margin: 0 4vw 0 1vw;">Now import these statistics into database</b>',
 cIcon='success', cTime='180000'){
    alertComponent.fire({
        target: document.getElementById('statsGeneration'),
        title: cTitle,
        html: cHtml,
        padding: '2vh 4vh 2vh 4vh',
        customClass: 'processStatsAlert',
        position: 'top',
        background: '#F2F2F2',
        icon: cIcon,
        focusCancel: true,
        showConfirmButton: true,
        confirmButtonText: 'Stay Here',
        confirmButtonColor: 'grey',
        showCancelButton: true,
        cancelButtonText: 'Move Forward',
        cancelButtonColor: '#E86135',
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
            document.getElementById("databaseTabButton").click();
			document.getElementById("impDB").click();
        }
    });
}

function general_stop_alerts(cTarget, cTitle, cIcon, cClass, cTime=600, cProgress=false){
    alertComponent.fire({
        title: cTitle,
        target: document.getElementById(cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: '#F2F2F2',
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
        target: document.getElementById(cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: '#F2F2F2',
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
        target: document.getElementById(cTarget),
        customClass: cClass,
        padding: '2vh 2vh 2vh 2vh',
        position: 'top',
        background: '#F2F2F2',
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
        document.getElementById(cResult).style.display = "block";
    });
}

function database_error_alerts(cTarget, cTitle, cHtml, cIcon, cClass, cTime, cBColor){
    alertComponent.fire({
        target: document.getElementById(cTarget),
        title: cTitle,
        html: cHtml,
        padding: '2vh 4vh 2vh 4vh',
        customClass: cClass,
        position: 'center',
        background: '#F2F2F2',
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