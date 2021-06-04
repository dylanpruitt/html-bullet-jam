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
    }
});

let basicWeapon = (parent) => {
    let weapon = {
        name: "Basic Weapon",
        range: 60,
        speedCap: 3.2,
        cooldownFrames: 45,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let bullet = basicBullet(parent.x, parent.y, projectileSpeeds[0], projectileSpeeds[1], parent.name);
            bullets.push(bullet);
            weapon.cooldownFrames = 45;
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let shotgun = (parent) => {
    let weapon = {
        name: "Shotgun",
        range: 60,
        speedCap: 5,
        cooldownFrames: 60,
        width: 4,
        height: 4,
        image: assets.get("images/bullets/bullet.png"),
        imagePath: "images/bullets/bullet.png",
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let bullet = shotgunBullet(parent.x, parent.y, projectileSpeeds[0], projectileSpeeds[1], parent.name);
            bullets.push(bullet);
            weapon.cooldownFrames = 45;
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
            let bullet = grassTrapBullet(parent.x, parent.y, weapon.speedCap, weapon.speedCap, parent.name);
            bullets.push(bullet);
            bullet = grassTrapBullet(parent.x, parent.y, -weapon.speedCap, weapon.speedCap, parent.name);
            bullets.push(bullet);
            bullet = grassTrapBullet(parent.x, parent.y, weapon.speedCap, -weapon.speedCap, parent.name);
            bullets.push(bullet);
            bullet = grassTrapBullet(parent.x, parent.y, -weapon.speedCap, -weapon.speedCap, parent.name);
            bullets.push(bullet);
        },
    }
    return Object.assign(weapon, weaponProperties(weapon, parent));
}

let weaponConstructors = [basicWeapon, shotgun, grassTrapWeapon];