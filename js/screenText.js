let screenText = [];

const textProperties = (text) => ({
    update: () => {
        if (text.waitFrames > 0) {
            text.waitFrames--;
        } else if (text.fadeFrames > 0) {
            text.fadeFrames--;
            text.opacity -= (1 / text.totalFadeFrames);
        }
    },
});

let locationMessage = (message, x, y) => {
    let text = {
        message: message,
        x: x,
        y: y,
        fontSize: "12px",
        color: "white",
        opacity: 1,
        waitFrames: 150,
        fadeFrames: 100,
        totalFadeFrames: 100,
    };

    return Object.assign(text, textProperties(text));
}

let damageMessage = (message, x, y) => {
    let text = {
        message: message,
        x: x,
        y: y,
        fontSize: "6px",
        color: "red",
        opacity: 1,
        waitFrames: 50,
        fadeFrames: 0,
        totalFadeFrames: 0,
        update: () => {
            if (text.waitFrames > 0) {
                text.waitFrames--;
                text.y -= 0.2;
            }
        },
    };

    return text;
}