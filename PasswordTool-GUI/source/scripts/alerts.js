const alertComponent = require('sweetalert2');


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


function moving_forward_to_stats(){

    alertComponent.fire({
        target: document.getElementById('processTab'),
        title: '<b style="color:#5c0e51;">Finished</b>',
        html: '<b style="margin: 0 4vw 0 1vw;">Let\'s move to create statistics</b>',
        padding: '2vh 4vh 2vh 4vh',
        customClass: 'processAnalyzeAlert',
        position: 'top',
        background: '#F2F2F2',
        icon: 'success',
        focusCancel: true,
        showConfirmButton: true,
        confirmButtonText: 'Stay Here',
        confirmButtonColor: 'grey',
        showCancelButton: true,
        cancelButtonText: 'Move Forward',
        cancelButtonColor: '#78126A',
        timer: 4000,
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

function moving_forward_to_importDB(){
    alertComponent.fire({
        target: document.getElementById('statsGeneration'),
        title: '<b style="color:#E86135;">Finished</b>',
        html: '<b style="margin: 0 4vw 0 1vw;">Now import these statistics into database</b>',
        padding: '2vh 4vh 2vh 4vh',
        customClass: 'processStatsAlert',
        position: 'top',
        background: '#F2F2F2',
        icon: 'success',
        focusCancel: true,
        showConfirmButton: true,
        confirmButtonText: 'Stay Here',
        confirmButtonColor: 'grey',
        showCancelButton: true,
        cancelButtonText: 'Move Forward',
        cancelButtonColor: '#E86135',
        timer: 180000,
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

function database_acknowledgment(cTarget='importDB', cTitle='Imported Successfully', cIcon='success', cClass='databaseImportAlert', cResult='importDbResult'){
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
        timer: 2000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', alertComponent.stopTimer)
            toast.addEventListener('mouseleave', alertComponent.resumeTimer)
        }
    }).then((result) => {
        document.getElementById(cResult).style.display = "block";
    });
}

module.exports = {
    home_pattern_error,
    moving_forward_to_stats,
    moving_forward_to_importDB,
    database_acknowledgment,
}