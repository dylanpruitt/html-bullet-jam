const weaponProperties = (weapon, parent) => ({
    update: () => {
        if (weapon.cooldownFrames > 0) {
            weapon.cooldownFrames--;
        }
    },
    getProjectileSpeed: (cursorX, cursorY) => {
        let xDistance = cursorX - parent.x;
        let yDistance = cursorY - parent.y;
        let angle = Math.atan(yDistance / xDistance);

        let xSpeed = weapon.speedCap * Math.cos(angle);
        let ySpeed = weapon.speedCap * Math.sin(angle);
        if (xDistance < 0) { xSpeed *= -1; ySpeed *= -1; }

        return [xSpeed, ySpeed];
    },
    spreadFire: (cursorX, cursorY, bulletType, spreadAngle, numBullets) => {
        let xDistance = cursorX - parent.x;
        let yDistance = cursorY - parent.y;
        let baseAngle = Math.atan(yDistance / xDistance);
        for (let i = 0; i < numBullets; i++) {
            let spreadRadians = Math.PI * (spreadAngle / 180);
            let angle = baseAngle + Math.random() * spreadRadians - (spreadRadians / 2);
            if (angle < 0) {
                angle = 2 * Math.PI + angle;
            }
            let xSpeed = weapon.speedCap * Math.cos(angle);
            let ySpeed = weapon.speedCap * Math.sin(angle);
            if (xDistance < 0) { xSpeed *= -1; ySpeed *= -1; }

            let spawnX = parent.x + (parent.width / 2) - 1;
            let spawnY = parent.y + (parent.height / 2) - 1;
            let bullet = bulletType(spawnX, spawnY, xSpeed, ySpeed, parent.faction);
            bullets.push(bullet);
        }
    }
});

let basicWeapon = (parent) => {
    let weapon = {
        name: "Basic Weapon",
        range: 60,
        speedCap: 3.2,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let spawnX = parent.x + (parent.width / 2) - 1;
            let spawnY = parent.y + (parent.height / 2) - 1;
            let bullet = basicBullet(spawnX, spawnY, projectileSpeeds[0], projectileSpeeds[1], parent.faction);
            bullets.push(bullet);
            weapon.cooldownFrames = 25;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let shotgun = (parent) => {
    let weapon = {
        name: "Shotgun",
        range: 60,
        speedCap: 5,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            weapon.spreadFire(cursorX, cursorY, shotgunBullet, 90, 4);
            weapon.cooldownFrames = 100;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let grassTrapWeapon = (parent) => {
    let weapon = {
        range: 40,
        speedCap: 2.5,
        cooldownFrames: 0,
        width: 5,
        height: 5,
        image: assets.get("images/bullets/trap-bullet.png"),
        imagePath: "images/bullets/trap-bullet.png",
        onFire: (cursorX, cursorY) => {
            weapon.spreadFire(cursorX, cursorY, grassTrapBullet, 360, 8);
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let switcherooWeapon = (parent) => {
    let weapon = {
        name: "Switcheroo",
        range: 100,
        speedCap: 1,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let targetDistance = parent.getClosestTargetDistance();
            let targetIndex = parent.getClosestTargetIndex();

            if (targetDistance <= weapon.range) {
                let target = entities[targetIndex];
                let tempX = parent.x, tempY = parent.y;

                parent.x = target.x;
                parent.y = target.y;
                target.x = tempX;
                target.y = tempY;
            }

            weapon.cooldownFrames = 250;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let dashWeapon = (parent) => {
    let weapon = {
        name: "Dash",
        range: 100,
        speedCap: 1,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            parent.addStatus(dashConstructor, 50);

            weapon.cooldownFrames = 125;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let machineGun = (parent) => {
    let weapon = {
        name: "Machine Gun",
        range: 73,
        speedCap: 4,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let spawnX = parent.x + (parent.width / 2) - 1;
            let spawnY = parent.y + (parent.height / 2) - 1;
            let bullet = basicBullet(spawnX, spawnY, projectileSpeeds[0], projectileSpeeds[1], parent.faction);
            bullets.push(bullet);
            weapon.cooldownFrames = 10;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let frenzyWeapon = (parent) => {
    let weapon = {
        name: "Frenzy",
        range: 73,
        speedCap: 6,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let spawnX = parent.x + (parent.width / 2) - 1;
            let spawnY = parent.y + (parent.height / 2) - 1;
            let bullet = frenzyBullet(spawnX, spawnY, projectileSpeeds[0], projectileSpeeds[1], parent.faction);
            bullets.push(bullet);
            weapon.cooldownFrames = 150;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let freezeWeapon = (parent) => {
    let weapon = {
        name: "Freeze",
        range: 73,
        speedCap: 6,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let spawnX = parent.x + (parent.width / 2) - 1;
            let spawnY = parent.y + (parent.height / 2) - 1;
            let bullet = freezeBullet(spawnX, spawnY, projectileSpeeds[0], projectileSpeeds[1], parent.faction);
            bullets.push(bullet);
            weapon.cooldownFrames = 75;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let tntWeapon = (parent) => {
    let weapon = {
        range: 40,
        speedCap: 7,
        cooldownFrames: 0,
        width: 5,
        height: 5,
        image: assets.get("images/bullets/trap-bullet.png"),
        imagePath: "images/bullets/trap-bullet.png",
        onFire: (cursorX, cursorY) => {
            weapon.spreadFire(cursorX, cursorY, tntBullet, 360, 16);
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let trapWeapon = (parent) => {
    let weapon = {
        name: "Spawn TNT",
        range: 80,
        speedCap: 1,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let xDistance = cursorX - parent.x;
            let yDistance = cursorY - parent.y;
            let distance = Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));

            if (distance < weapon.range && weapon.cooldownFrames == 0) {
                entities.push(tntConstructor(cursorX, cursorY));
                weapon.cooldownFrames = 125;
            }
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let flingWeapon = (parent) => {
    let weapon = {
        name: "Fling",
        range: 80,
        speedCap: 10,
        cooldownFrames: 0,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let spawnX = parent.x + (parent.width / 2) - 1;
            let spawnY = parent.y + (parent.height / 2) - 1;
            let bullet = disableBullet(spawnX, spawnY, projectileSpeeds[0], projectileSpeeds[1], parent.speedX, parent.speedY, parent.faction);
            bullets.push(bullet);
            weapon.cooldownFrames = 100;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let weaponConstructors = [basicWeapon, shotgun, grassTrapWeapon, switcherooWeapon, dashWeapon, machineGun, frenzyWeapon, freezeWeapon,
    tntWeapon, trapWeapon, flingWeapon];