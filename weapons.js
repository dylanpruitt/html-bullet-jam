let basicWeapon = (parent) => {
    let weapon = {
        range: 60,
        speedCap: 2.4,
        cooldownFrames: 45,
        width: 4,
        height: 4,
        image: new Image(),
        update: () => {
            if (weapon.cooldownFrames > 0) {
                weapon.cooldownFrames--;
            }
        },
        onFire: (cursorX, cursorY) => {
            let projectileSpeeds = weapon.getProjectileSpeed(cursorX, cursorY);
            let bullet = basicBullet(parent.x, parent.y, projectileSpeeds[0], projectileSpeeds[1], parent.name);
            bullets.push(bullet);
            weapon.cooldownFrames = 45;
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
    }
    weapon.image.src = "bullet.png";
    return weapon;
}