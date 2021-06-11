let dashConstructor = (parent, cursorX, cursorY) => {
    let status = {
        name: "Dash",
        originalSpeedCap: parent.speedCap,
        framesLeft: 50,
        update: () => {
            status.framesLeft--;
            parent.speedX *= 0.95;
            parent.speedY *= 0.95;
        },
        onStatusEnd: () => {
            parent.speedCap = status.originalSpeedCap;
        },
    }

    parent.speedCap = status.originalSpeedCap * 2.5;
    
    let xDistance = cursorX - parent.x;
    let yDistance = cursorY - parent.y;
    let angle = Math.atan(yDistance / xDistance);

    parent.speedX = parent.speedCap * Math.cos(angle);
    parent.speedY = parent.speedCap * Math.sin(angle);
    if (xDistance < 0) { parent.speedX *= -1; parent.speedY *= -1; }

    return status;
}