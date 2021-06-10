let entities = [];

const entityProperties = (entity) => ({
    updatePosition: () => {
        let entityX = entity.x;
        let entityY = entity.y;

        entity.x += entity.speedX;

        for (let i = 0; i < boundingBoxes.length; i++) {
            if (entityCollidingWithBounds(entity, boundingBoxes[i])) {
                entity.x = entityX;
                entity.speedX = 0;
            }
        }

        entity.y += entity.speedY;

        for (let i = 0; i < boundingBoxes.length; i++) {
            if (entityCollidingWithBounds(entity, boundingBoxes[i])) {
                entity.y = entityY;
                entity.speedY = 0;
            }
        }
    },
    collidingWith: (object) => {
        return (((entity.x < object.x && object.x < (entity.x + entity.width)) 
            || (entity.x < (object.x + object.width) && (object.x + object.width) < (entity.x + entity.width)))
            && ((entity.y < object.y && object.y < (entity.y + entity.height))
            || (entity.y < (object.y + object.height) && (object.y + object.height) < (entity.y + entity.height))));
    }
});

let playerConstructor = (x, y) => {
    let entity = {
        name: "Player",
        faction: "player",
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
        activeWeaponIndex: 0,
        update: () => {
            entity.updatePosition();
            entity.updateSpeed();
            entity.equippedWeapon.update();
        },
        updateSpeed: () => {
            if (entity.speedX > 0) { entity.speedX -= 0.05; }
            if (entity.speedY > 0) { entity.speedY -= 0.05; }
            if (entity.speedX < 0) { entity.speedX += 0.05; }
            if (entity.speedY < 0) { entity.speedY += 0.05; }
            if (Math.abs(entity.speedX) <= 0.05) { entity.speedX = 0; }
            if (Math.abs(entity.speedY) <= 0.05) { entity.speedY = 0; }
        },
        collidingWith: (object) => {
            return (((entity.x < object.x && object.x < (entity.x + entity.width)) 
                || (entity.x < (object.x + object.width) && (object.x + object.width) < (entity.x + entity.width)))
                && ((entity.y < object.y && object.y < (entity.y + entity.height))
                || (entity.y < (object.y + object.height) && (object.y + object.height) < (entity.y + entity.height))));
        }
    }
    entity.image.src = "images/entities/player.png";
    entity.equippedWeapon = basicWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let wolfConstructor = (x, y) => {
    let entity = {
        name: "Wolf",
        faction: "enemy",
        health: 13,
        maxHealth: 13,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 3,
        width: 16,
        height: 12,
        image: assets.get("images/entities/wolf.png"),
        imagePath: "images/entities/wolf.png",
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
        
    }
    entity.equippedWeapon = basicWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let grassTrapConstructor = (x, y) => {
    let entity = {
        name: "Grass Trap",
        faction: "trap",
        health: 1,
        maxHealth: 1,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        width: 7,
        height: 7,
        image: assets.get("images/entities/grass-trap.png"),
        imagePath: "images/entities/grass-trap.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        framesIdle: 120,
        equippedWeapon: {},
        update: (player) => {
            entity.updateAI(player);
            entity.equippedWeapon.update();
        },
        updateAI: (player) => {
            let distanceFromPlayer = Math.sqrt(Math.pow(player.x - entity.x, 2) + Math.pow(player.y - entity.y, 2));
            if (distanceFromPlayer < 40) {
                entity.equippedWeapon.onFire(player.x, player.y);
                entity.health = 0;
            }
        },
    }
    entity.equippedWeapon = grassTrapWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let sheepConstructor = (x, y) => {
    let entity = {
        name: "Sheep",
        faction: "neutral",
        health: 5,
        maxHealth: 5,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 3,
        width: 12,
        height: 12,
        image: assets.get("images/entities/sheep.png"),
        imagePath: "images/entities/sheep.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        framesIdle: 120,
        equippedWeapon: {},
        update: (player) => {
            entity.updateAI(player);
            entity.updatePosition();
        },
        updateAI: (player) => {
            let distanceFromPlayer = Math.sqrt(Math.pow(player.x - entity.x, 2) + Math.pow(player.y - entity.y, 2));
            if (distanceFromPlayer > 80) {
                entity.idleAI();
            } else {
                entity.panicAI(player);
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
        panicAI: (player) => {
            entity.aiGoalX = Math.floor((Math.random() * 10) - 5 + player.x);
            entity.aiGoalY = Math.floor((Math.random() * 10) - 5 + player.y);

            if (entity.x > entity.aiGoalX) { entity.speedX = 1.3; }
            if (entity.y > entity.aiGoalY) { entity.speedY = 1.3; }
            if (entity.x < entity.aiGoalX) { entity.speedX = -1.3; }
            if (entity.y < entity.aiGoalY) { entity.speedY = -1.3; }
        },
        
    }
    entity.equippedWeapon = basicWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let crateConstructor = (x, y) => {
    let entity = {
        name: "Crate",
        health: 8,
        maxHealth: 8,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 3,
        width: 14,
        height: 14,
        image: assets.get("images/entities/crate.png"),
        imagePath: "images/entities/crate.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        framesIdle: 120,
        equippedWeapon: {},
        update: (player) => {
            entity.updatePosition();
        }, 
    }
    entity.equippedWeapon = basicWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let entityConstructors = [wolfConstructor, grassTrapConstructor, sheepConstructor, crateConstructor];

let getEntityConstructorIndexFromName = (name) => {
    let NOT_FOUND = -1;

    for (let i = 0; i < entityConstructors.length; i++) {
        let temp = entityConstructors[i](0, 0);
        if (temp.name === name) {
            return i;
        }
    }

    return NOT_FOUND;
}