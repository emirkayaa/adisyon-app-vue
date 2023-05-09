class FormVerification {
    static inputs = [];

    static switchTheme(themeName = `light`) {
        document.body.dataset.theme = themeName;
    }

    static handleInput(target) {
        let nextInput = target.nextElementSibling;

        /* NOTE :
         * if any input avaialbe in next and current input
         * filled with value, then, focus next input and if next input
         * value exist, select the text to change new value
         */
        if (nextInput && target.value) {
            nextInput.focus();
            nextInput.value && nextInput.select();
        }
    }
    static handleBackspace(target) {
        return target.value ?
            (target.value = "") :
            target.previousElementSibling.focus();
    }
    static handleArrowLeft(target) {
        const previousInput = target.previousElementSibling;
        return !previousInput ? undefined : previousInput.focus();
    }
    static handleArrowRight(target) {
        const nextInput = target.nextElementSibling;
        return !nextInput ? undefined : nextInput.focus();
    }
    static handlePaste(event, inputs) {
        // NOTE : get last text saved on clipboard
        let pasteText = (event.clipboardData || window.clipboardData).getData(
            "text"
        );

        // NOTE : change inputs value with clipboard text
        inputs.forEach((input, index) => {
            input.value = pasteText[index] || ``;
        });
        event.preventDefault();
    }
}

function shortcut(element, key, handle) {
    element.addEventListener(`keydown`, (e) => {
        return e.key.toString().toLowerCase() == key && handle(element);
    });
}

function timeFormat(duration = 0) {
    let minutes = ~~((duration % 3600) / 60);
    let seconds = ~~duration % 60;
    let min = minutes < 10 ? `0${minutes}` : minutes;
    let sec = seconds < 10 ? `0${seconds}` : seconds;
    return `${min} : ${sec}`;
}

function timer(
    seconds = 120,
    target = document.querySelector(`.verification__counter`)
) {
    target.innerHTML = timeFormat(seconds);
    if (seconds < 0) {
        target.innerHTML = `00 : 00`;
        document
            .querySelector(`.verification`)
            .classList.add(`verification--timed-out`);
        return;
    }
    return window.setTimeout(() => timer(seconds - 1), 1100);
    // return timer(seconds - 1);
}