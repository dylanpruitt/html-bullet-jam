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

            //// MORE THAN BASIC BULLETS SHOULD BE COVERED!
            let bullet = bulletType(parent.x, parent.y, xSpeed, ySpeed, parent.name);
            bullets.push(bullet);
        }
    }
});

let basicWeapon = (parent) => {
    let weapon = {
        name: "Basic Weapon",
        range: 60,
        speedCap: 3.2,
        cooldownFrames: 25,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let bullet = basicBullet(parent.x, parent.y, projectileSpeeds[0], projectileSpeeds[1], parent.name);
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
        cooldownFrames: 100,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            weapon.spreadFire(cursorX, cursorY, basicBullet, 90, 4);
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
        cooldownFrames: 250,
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
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let weaponConstructors = [basicWeapon, shotgun, grassTrapWeapon, switcherooWeapon];