const statusProperties = (parent) => ({
    framesLeft: 100,
    update: () => {
        framesLeft--;
    },
    onStatusEnd: () => {

    },
});

let dashConstructor = (parent, cursorX, cursorY) => {
    let status = {
        name: "Dash",
        originalSpeedCap: parent.speedCap,
        update: () => {
            framesLeft--;
        },
        onStatusEnd: () => {
            parent.speedCap = status.originalSpeedCap;
        },
    }

    parent.speedCap = status.originalSpeedCap * 4;
    
    let xDistance = cursorX - parent.x;
    let yDistance = cursorY - parent.y;
    let angle = Math.atan(yDistance / xDistance);

    parent.speedX = parent.speedCap * Math.cos(angle);
    parent.speedY = parent.speedCap * Math.sin(angle);
    if (xDistance < 0) { parent.speedX *= -1; parent.speedY *= -1; }

    return Object.assign(status, statusProperties(parent));
}