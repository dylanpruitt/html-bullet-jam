let bullets = [];

let basicBullet = (x, y, speedX, speedY, creatorName) => {
    let bullet = {
        creatorName: creatorName,
        damage: 3,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 2,
        width: 4,
        height: 4,
        image: new Image(),
        framesActive: 0,
        maxFramesActive: 60,
        update: () => {
            bullet.updatePosition();
            bullet.updateSpeed();
            bullet.framesActive++;
        },
        updatePosition: () => {
            bullet.x += bullet.speedX;
            bullet.y += bullet.speedY;
        },
        updateSpeed: () => {
            bullet.speedX *= 0.95;
            bullet.speedY *= 0.95;
            if (Math.abs(bullet.speedX) < 0.1) { bullet.speedX = 0; }
            if (Math.abs(bullet.speedY) < 0.1) { bullet.speedY = 0; }
        },
        onCollide: (entity) => {
            if (entity.name !== bullet.creatorName) {
                bullet.framesActive = bullet.maxFramesActive;
                entity.health -= bullet.damage;
            }
        }
    }
    bullet.image.src = "images/bullets/bullet.png";
    return bullet;
}