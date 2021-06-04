let bullets = [];

const bulletProperties = (bullet) => ({
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
        bullet.speedX *= bullet.acceleration;
        bullet.speedY *= bullet.acceleration;
        if (Math.abs(bullet.speedX) < 0.1) { bullet.speedX = 0; }
        if (Math.abs(bullet.speedY) < 0.1) { bullet.speedY = 0; }
    },
    onCollide: (entity) => {
        if (entity.name !== bullet.creatorName) {
            bullet.framesActive = bullet.maxFramesActive;
            entity.health -= bullet.damage;
        }
    }
});



let basicBullet = (x, y, speedX, speedY, creatorName) => {
    let bullet = {
        creatorName: creatorName,
        damage: 3,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 2,
        acceleration: 0.95,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        framesActive: 0,
        maxFramesActive: 60,

    }
    return Object.assign(bullet, bulletProperties(bullet));
}

let shotgunBullet = (x, y, speedX, speedY, creatorName) => {
    let bullet = {
        creatorName: creatorName,
        damage: 3,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 2,
        acceleration: 0.80,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        framesActive: 0,
        maxFramesActive: 40,
    }
    return Object.assign(bullet, bulletProperties(bullet));
}

let grassTrapBullet = (x, y, speedX, speedY, creatorName) => {
    let bullet = {
        creatorName: creatorName,
        damage: 1,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 2,
        acceleration: 0.95,
        width: 5,
        height: 5,
        image: assets.get("images/bullets/trap-bullet.png"),
        imagePath: "images/bullets/trap-bullet.png",
        framesActive: 0,
        maxFramesActive: 75,
    }
    return Object.assign(bullet, bulletProperties(bullet));
}

let bulletConstructors = [basicBullet, shotgunBullet, grassTrapBullet];