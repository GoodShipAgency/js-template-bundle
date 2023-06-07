function disableButton(target) {
    if (!target) return;
    // We have to use setTimeout due to weird behaviour with chrome
    setTimeout(function () {
        target.disabled = true;
    }, 0);
}

function disableFormsOnSubmit() {
    const allForms = document.body.querySelectorAll('form:not([hx-target])');
    if (allForms.length) {
        allForms.forEach((form) => {
            form.addEventListener('submit', (event) => {
                disableButton(event.target.querySelector('button[type="submit"]'));
            });
        });
    }
}

export { disableButton, disableFormsOnSubmit };
