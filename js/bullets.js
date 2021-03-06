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
        if (entity.faction !== bullet.creatorFaction) {
            bullet.framesActive = bullet.maxFramesActive;
            entity.health -= bullet.damage;
            screenText.push(damageMessage(bullet.damage, entity.x + xOffset, entity.y + yOffset));
        }
    }
});



let basicBullet = (x, y, speedX, speedY, creatorFaction) => {
    let bullet = {
        damage: 15,
        creatorFaction: creatorFaction,
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

let shotgunBullet = (x, y, speedX, speedY, creatorFaction) => {
    let bullet = {
        damage: 30,
        creatorFaction: creatorFaction,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 5,
        acceleration: 0.87,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        framesActive: 0,
        maxFramesActive: 40,
    }
    return Object.assign(bullet, bulletProperties(bullet));
}

let grassTrapBullet = (x, y, speedX, speedY, creatorFaction) => {
    let bullet = {
        damage: 25,
        creatorFaction: creatorFaction,
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

let machineGunBullet = (x, y, speedX, speedY, creatorFaction) => {
    let bullet = {
        damage: 3,
        creatorFaction: creatorFaction,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 4,
        acceleration: 0.92,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        framesActive: 0,
        maxFramesActive: 60,

    }
    return Object.assign(bullet, bulletProperties(bullet));
}

let frenzyBullet = (x, y, speedX, speedY, creatorFaction) => {
    let bullet = {
        damage: 0,
        creatorFaction: creatorFaction,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 6,
        acceleration: 0.93,
        width: 5,
        height: 5,
        image: assets.get("images/bullets/frenzy.png"),
        imagePath: "images/bullets/frenzy.png",
        framesActive: 0,
        maxFramesActive: 100,
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
            if (entity.faction !== bullet.creatorFaction) {
                entity.addStatus(frenzyConstructor, 125);
                bullet.framesActive = bullet.maxFramesActive;
            }
        }
    }
    return bullet;
}

let freezeBullet = (x, y, speedX, speedY, creatorFaction) => {
    let bullet = {
        damage: 0,
        creatorFaction: creatorFaction,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 6,
        acceleration: 0.92,
        width: 5,
        height: 5,
        image: assets.get("images/bullets/frenzy.png"),
        imagePath: "images/bullets/frenzy.png",
        framesActive: 0,
        maxFramesActive: 100,
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
            if (entity.faction !== bullet.creatorFaction) {
                entity.addStatus(freezeConstructor, 60);
                bullet.framesActive = bullet.maxFramesActive;
            }
        }
    }
    return bullet;
}

let tntBullet = (x, y, speedX, speedY, creatorFaction) => {
    let bullet = {
        damage: 10,
        creatorFaction: creatorFaction,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 7,
        acceleration: 0.95,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        framesActive: 0,
        maxFramesActive: 50,

    }
    return Object.assign(bullet, bulletProperties(bullet));
}

let disableBullet = (x, y, speedX, speedY, parentSpeedX, parentSpeedY, creatorFaction) => {
    let bullet = {
        damage: 0,
        creatorFaction: creatorFaction,
        x: x,
        y: y,
        speedX: speedX,
        speedY: speedY,
        speedCap: 10,
        acceleration: 0.8,
        width: 5,
        height: 5,
        image: assets.get("images/bullets/frenzy.png"),
        imagePath: "images/bullets/frenzy.png",
        framesActive: 0,
        maxFramesActive: 50,
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
            if (entity.faction !== bullet.creatorFaction) {
                let status = disableConstructor(entity, 75, parentSpeedX, parentSpeedY);
                let index = entity.getStatusIndexByName(status.name);
                if (index > -1) {
                    entity.statuses[index].framesLeft += frames;
                } else {
                    entity.statuses.push(status);
                }
                bullet.framesActive = bullet.maxFramesActive;
            }
        }
    }

    return bullet;
}

let bulletConstructors = [basicBullet, shotgunBullet, grassTrapBullet, machineGunBullet, frenzyBullet, freezeBullet, tntBullet, disableBullet];