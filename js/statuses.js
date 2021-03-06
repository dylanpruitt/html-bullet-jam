let dashConstructor = (parent, frames) => {
    let status = {
        name: "Dash",
        originalSpeedCap: parent.speedCap,
        framesLeft: frames,
        update: () => {
            status.framesLeft--;
            parent.speedX *= 0.96;
            parent.speedY *= 0.96;
            parent.speedCap *= 0.96;
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

let frenzyConstructor = (parent, frames) => {
    let status = {
        name: "Frenzy",
        originalFaction: parent.faction,
        framesLeft: frames,
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

let disableConstructor = (parent, frames, speedX, speedY) => {
    let status = {
        name: "Disable",
        originalSpeedCap: parent.speedCap,
        framesLeft: frames,
        update: () => {
            status.framesLeft--;
            parent.speedX *= 0.95;
            parent.speedY *= 0.95;
            parent.speedCap *= 0.95;
        },
        onStatusEnd: () => {
            parent.speedCap = status.originalSpeedCap;
            parent.controlEnabled = true;
        },
    }

    parent.speedCap = status.originalSpeedCap * 2.5;

    parent.speedX = speedX * 2;
    parent.speedY = speedY * 2;

    parent.controlEnabled = false;

    return status;
}