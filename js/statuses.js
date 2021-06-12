let dashConstructor = (parent) => {
    let status = {
        name: "Dash",
        originalSpeedCap: parent.speedCap,
        framesLeft: 50,
        update: () => {
            status.framesLeft--;
            parent.speedX *= 0.95;
            parent.speedY *= 0.95;
            parent.speedCap *= 0.95;
        },
        onStatusEnd: () => {
            parent.speedCap = status.originalSpeedCap;
        },
    }

    parent.speedCap = status.originalSpeedCap * 2.5;

    parent.speedX *= 2.5;
    parent.speedY *= 2.5;

    return status;
}

let slowConstructor = (parent) => {
    let status = {
        name: "Slow",
        originalSpeedCap: parent.speedCap,
        framesLeft: 25,
        update: () => {
            status.framesLeft--;
        },
        onStatusEnd: () => {
            parent.speedCap = status.originalSpeedCap;
        },
    }

    parent.speedCap = status.originalSpeedCap / 2;

    parent.speedX /= 2;
    parent.speedY /= 2;

    return status;
}

let freezeConstructor = (parent, frames) => {
    let status = {
        name: "Frozen",
        originalSpeedCap: parent.speedCap,
        framesLeft: frames,
        update: () => {
            status.framesLeft--;
            parent.speedX = 0.0;
            parent.speedY = 0.0;
        },
        onStatusEnd: () => {
            parent.speedCap = status.originalSpeedCap;
        },
    }

    parent.speedCap = 0;

    return status;
}

let frenzyConstructor = (parent) => {
    let status = {
        name: "Frenzy",
        originalFaction: parent.faction,
        framesLeft: 500,
        update: () => {
            status.framesLeft--;
        },
        onStatusEnd: () => {
            parent.faction = status.originalFaction;
        },
    }

    parent.faction = "frenzy";
    return status;
}