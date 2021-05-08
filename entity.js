let entities = [];

let playerConstructor = (x, y) => {
    let entity = {
        name: "Player",
        health: 20,
        maxHealth: 20,
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
            entity.equippedWeapon.update();
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
        },
        collidingWith: (object) => {
            return (entity.x < object.x < entity.x + entity.width 
                || entity.x < object.x + object.width < entity.x + entity.width
                || entity.y < object.y < entity.y + entity.height
                || entity.y < object.y + object.height < entity.y + entity.height);
        }
    }
    entity.image.src = "player.png";
    entity.equippedWeapon = basicWeapon(entity);
    return entity;
}

let wolfConstructor = (x, y) => {
    let entity = {
        name: "Wolf",
        health: 13,
        maxHealth: 13,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 3,
        width: 16,
        height: 12,
        image: new Image(),
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        framesIdle: 120,
        equippedWeapon: {},
        update: (player) => {
            entity.updateAI(player);
            entity.updatePosition();
            entity.equippedWeapon.update();
        },
        updatePosition: () => {
            entity.x += entity.speedX;
            entity.y += entity.speedY;
        },
        updateAI: (player) => {
            let distanceFromPlayer = Math.sqrt(Math.pow(player.x - entity.x, 2) + Math.pow(player.y - entity.y, 2));
            if (distanceFromPlayer > 60) {
                entity.idleAI();
            } else {
                entity.chaseAI(player);
            }

            if (Math.abs(entity.x - entity.aiGoalX) <= 1) { 
                entity.x = entity.aiGoalX; 
                entity.speedX = 0;
            }
            if (Math.abs(entity.y - entity.aiGoalY) <= 1) { 
                entity.y = entity.aiGoalY; 
                entity.speedY = 0;
            }
        },
        idleAI: () => {
            if (entity.aiGoalX == 0 || entity.aiGoalY == 0 
                || (entity.x == entity.aiGoalX && entity.y == entity.aiGoalY)) {     
                if (entity.x == entity.aiGoalX && entity.y == entity.aiGoalY) {
                    entity.framesIdle++;
                }
                if (entity.framesIdle == 150) {
                    entity.aiGoalX = Math.floor((Math.random() * 60) - 30 + entity.x);
                    entity.aiGoalY = Math.floor((Math.random() * 60) - 30 + entity.y);
                    entity.framesIdle = 0;
                }
            }
 
            if (entity.x > entity.aiGoalX) { entity.speedX = -1; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -1; }
            if (entity.x < entity.aiGoalX) { entity.speedX = 1; }
            if (entity.y < entity.aiGoalY) { entity.speedY = 1; }
        },
        chaseAI: (player) => {
            entity.aiGoalX = Math.floor((Math.random() * 10) - 5 + player.x);
            entity.aiGoalY = Math.floor((Math.random() * 10) - 5 + player.y);

            if (entity.x > entity.aiGoalX) { entity.speedX = -1.3; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -1.3; }
            if (entity.x < entity.aiGoalX) { entity.speedX = 1.3; }
            if (entity.y < entity.aiGoalY) { entity.speedY = 1.3; }

            if (entity.equippedWeapon.cooldownFrames == 0) {
                entity.equippedWeapon.onFire(player.x, player.y);
            }
        },
        collidingWith: (object) => {
            return (((entity.x < object.x && object.x < (entity.x + entity.width)) 
                || (entity.x < (object.x + object.width) && (object.x + object.width) < (entity.x + entity.width)))
                && ((entity.y < object.y && object.y < (entity.y + entity.height))
                || (entity.y < (object.y + object.height) && (object.y + object.height) < (entity.y + entity.height))));
        }
    }
    entity.image.src = "wolf.png";
    entity.equippedWeapon = basicWeapon(entity);
    return entity;   
}