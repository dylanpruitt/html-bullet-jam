let playerConstructor = (x, y) => {
    let entity = {
        name: "Player",
        description: "No flowers here yet.",
        type: "na",
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 2,
        width: 6,
        height: 8,
        image: new Image(),
        update: () => {
            entity.updatePosition();
            entity.updateSpeed();
        },
        updatePosition: () => {
            entity.x += entity.speedX;
            entity.y += entity.speedY;
        },
        updateSpeed: () => {
            if (entity.speedX > 0) { entity.speedX -= 0.05; }
            if (entity.speedY > 0) { entity.speedY -= 0.05; }
            if (entity.speedX < 0) { entity.speedX += 0.05; }
            if (entity.speedY < 0) { entity.speedY += 0.05; }
            if (Math.abs(entity.speedX) < 0.1) { entity.speedX = 0; }
            if (Math.abs(entity.speedY) < 0.1) { entity.speedY = 0; }
        }
    }
    entity.image.src = "player.png";
    return entity;
}