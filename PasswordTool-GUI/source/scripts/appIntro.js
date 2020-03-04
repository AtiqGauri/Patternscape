function app_intro_alert(cTarget, cTitle, cHtml, cPosition, cClass, cNext){
    alertComponent.fire({
        target: document.getElementById(cTarget),
        title: cTitle,
        html: cHtml,
        padding: '2vh 4vh 2vh 4vh',
        customClass: cClass,
        position: cPosition,
        background: '#F2F2F2',
    }).then((result) => {
        if (result.value) {
            cNext();
        }
    });
}