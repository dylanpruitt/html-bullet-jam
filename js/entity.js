let entities = [];
let backgroundEntities = [];

const entityProperties = (entity) => ({
    statuses: [],
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
    },
    getClosestTargetDistance: () => {
        let closestDistance = 10000;
        for (let i = 0; i < entities.length; i++) {
            let distanceFromEntity = Math.sqrt(Math.pow(entity.x - entities[i].x, 2) + Math.pow(entity.y - entities[i].y, 2));
            if (distanceFromEntity < closestDistance && entity.faction !== entities[i].faction) {
                closestDistance = distanceFromEntity;
            }
        }
        return closestDistance;
    },
    getClosestTargetIndex: () => {
        let closestDistance = 10000, targetIndex = 0;
        for (let i = 0; i < entities.length; i++) {
            let distanceFromEntity = Math.sqrt(Math.pow(entity.x - entities[i].x, 2) + Math.pow(entity.y - entities[i].y, 2));
            if (distanceFromEntity < closestDistance && entity.faction !== entities[i].faction) {
                closestDistance = distanceFromEntity;
                targetIndex = i;
            }
        }
        return targetIndex;
    },
    updateStatuses: () => {
        let temp = [];
        for (let i = 0; i < entity.statuses.length; i++) {
            if (entity.statuses[i].framesLeft > 0) {
                temp.push(entity.statuses[i]);
                entity.statuses[i].update();
            } else {
                entity.statuses[i].onStatusEnd();
            }
        }

        entity.statuses = temp;
    }
});

let playerConstructor = (x, y) => {
    let entity = {
        name: "Player",
        faction: "player",
        health: 250,
        maxHealth: 250,
        controlEnabled: true,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 2,
        width: 6,
        height: 8,
        image: new Image(),
        activeWeaponIndex: 0,
        switchFrames: 0,
        update: () => {
            entity.updatePosition();
            entity.updateSpeed();
            entity.updateStatuses();
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
        background: false,
        health: 65,
        maxHealth: 65,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 1.3,
        width: 16,
        height: 12,
        image: assets.get("images/entities/wolf.png"),
        imagePath: "images/entities/wolf.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        targetIndex: 0,
        framesIdle: 120,
        equippedWeapon: {},
        update: () => {
            entity.updateAI();
            entity.updatePosition();
            entity.updateStatuses();
            entity.equippedWeapon.update();
        },
        updateAI: () => {
            entity.targetIndex = entity.getClosestTargetIndex();
            let targetDistance = entity.getClosestTargetDistance();
            if (targetDistance > 60) {
                entity.idleAI();
            } else {
                entity.chaseAI();
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
 
            if (entity.x > entity.aiGoalX) { entity.speedX = -entity.speedCap * 0.80; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -entity.speedCap * 0.80; }
            if (entity.x < entity.aiGoalX) { entity.speedX = entity.speedCap * 0.80; }
            if (entity.y < entity.aiGoalY) { entity.speedY = entity.speedCap * 0.80; }
        },
        chaseAI: () => {
            let target = entities[entity.targetIndex];
            entity.aiGoalX = Math.floor((Math.random() * 10) - 5 + target.x);
            entity.aiGoalY = Math.floor((Math.random() * 10) - 5 + target.y);

            if (entity.x > entity.aiGoalX) { entity.speedX = -entity.speedCap; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -entity.speedCap; }
            if (entity.x < entity.aiGoalX) { entity.speedX = entity.speedCap; }
            if (entity.y < entity.aiGoalY) { entity.speedY = entity.speedCap; }

            if (entity.equippedWeapon.cooldownFrames == 0) {
                entity.equippedWeapon.onFire(target.x, target.y);
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
        background: true,
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
        update: () => {
            entity.updateAI();
            entity.equippedWeapon.update();
        },
        updateAI: () => {
            let targetDistance = entity.getClosestTargetDistance();
            if (targetDistance < 40) {
                let targetIndex = entity.getClosestTargetIndex();
                entity.equippedWeapon.onFire(entities[targetIndex].x, entities[targetIndex].y);
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
        background: false,
        health: 35,
        maxHealth: 35,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 1.2,
        width: 12,
        height: 12,
        image: assets.get("images/entities/sheep.png"),
        imagePath: "images/entities/sheep.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        targetIndex: 0,
        framesIdle: 120,
        equippedWeapon: {},
        update: () => {
            entity.updateAI();
            entity.updateStatuses();
            entity.updatePosition();
        },
        updateAI: () => {
            if (entity.getClosestTargetDistance() > 80) {
                entity.idleAI();
            } else {
                entity.panicAI();
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
 
            if (entity.x > entity.aiGoalX) { entity.speedX = -entity.speedCap * 0.8; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -entity.speedCap * 0.8; }
            if (entity.x < entity.aiGoalX) { entity.speedX = entity.speedCap * 0.8; }
            if (entity.y < entity.aiGoalY) { entity.speedY = entity.speedCap * 0.8; }
        },
        panicAI: () => {
            let target = entities[entity.targetIndex];
            if (entity.x > target.x) { entity.speedX = entity.speedCap; }
            if (entity.y > target.y) { entity.speedY = entity.speedCap; }
            if (entity.x < target.x) { entity.speedX = -entity.speedCap; }
            if (entity.y < target.y) { entity.speedY = -entity.speedCap; }

            entity.aiGoalX = entity.x + entity.speedX;
            entity.aiGoalY = entity.y + entity.speedY;
        },
        
    }
    entity.equippedWeapon = basicWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let crateConstructor = (x, y) => {
    let entity = {
        name: "Crate",
        faction: "neutral",
        background: false,
        health: 60,
        maxHealth: 60,
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
        update: () => {
            entity.updatePosition();
        }, 
    }
    entity.equippedWeapon = basicWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let turretConstructor = (x, y) => {
    let entity = {
        name: "Autoturret",
        faction: "enemy",
        background: false,
        health: 180,
        maxHealth: 180,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 3,
        width: 16,
        height: 16,
        image: assets.get("images/entities/autoturret.png"),
        imagePath: "images/entities/autoturret.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        targetIndex: 0,
        framesIdle: 120,
        equippedWeapon: {},
        update: () => {
            entity.updateAI();
            entity.updatePosition();
            entity.updateStatuses();
            entity.equippedWeapon.update();
        },
        updateAI: () => {
            if (entity.getClosestTargetDistance() <= 70) {
                entity.targetIndex = entity.getClosestTargetIndex();
                entity.attackAI();
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
        attackAI: () => {
            let target = entities[entity.targetIndex];

            if (entity.equippedWeapon.cooldownFrames == 0) {
                entity.equippedWeapon.onFire(target.x, target.y);
            }
        },
    }
    entity.equippedWeapon = machineGun(entity);
    return Object.assign(entity, entityProperties(entity));
}

let spikeConstructor = (x, y) => {
    let entity = {
        name: "Spike Trap",
        faction: "trap",
        background: true,
        health: 9000,
        maxHealth: 9000,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 3,
        width: 16,
        height: 16,
        image: assets.get("images/entities/spike.png"),
        imagePath: "images/entities/spike.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        targetIndex: 0,
        cooldown: 0,
        equippedWeapon: {},
        update: () => {
            let entitiesDamaged = false;
            let ATTACK_DAMAGE = 5;
            for (let i = 0; i < entities.length; i++) {
                if (entity.collidingWith(entities[i]) && entity.cooldown < 1) {
                    entitiesDamaged = true;
                    entities[i].health -= ATTACK_DAMAGE;
                    screenText.push(damageMessage(ATTACK_DAMAGE, entities[i].x + xOffset, entities[i].y + yOffset));
                }
            }

            if (entitiesDamaged) {
                entity.cooldown = 25;
            } else {
                entity.cooldown--;
            }
        },
    }
    entity.equippedWeapon = basicWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let armorConstructor = (x, y) => {
    let entity = {
        name: "Armor",
        faction: "enemy",
        background: false,
        health: 240,
        maxHealth: 240,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        speedCap: 0.8,
        width: 24,
        height: 24,
        image: assets.get("images/entities/armor.png"),
        imagePath: "images/entities/armor.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        targetIndex: 0,
        framesIdle: 120,
        equippedWeapon: {},
        update: () => {
            entity.updateAI();
            entity.updatePosition();
            entity.updateStatuses();
            entity.equippedWeapon.update();
        },
        updateAI: () => {
            entity.targetIndex = entity.getClosestTargetIndex();
            let targetDistance = entity.getClosestTargetDistance();
            if (targetDistance > 90) {
                entity.idleAI();
            } else {
                entity.chaseAI();
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
 
            if (entity.x > entity.aiGoalX) { entity.speedX = -entity.speedCap * 0.80; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -entity.speedCap * 0.80; }
            if (entity.x < entity.aiGoalX) { entity.speedX = entity.speedCap * 0.80; }
            if (entity.y < entity.aiGoalY) { entity.speedY = entity.speedCap * 0.80; }
        },
        chaseAI: () => {
            let target = entities[entity.targetIndex];
            entity.aiGoalX = target.x;
            entity.aiGoalY = target.y;

            if (entity.x > entity.aiGoalX) { entity.speedX = -entity.speedCap; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -entity.speedCap; }
            if (entity.x < entity.aiGoalX) { entity.speedX = entity.speedCap; }
            if (entity.y < entity.aiGoalY) { entity.speedY = entity.speedCap; }

            if (entity.equippedWeapon.cooldownFrames == 0) {
                entity.equippedWeapon.onFire(target.x, target.y);
            }
        },
        
    }
    entity.equippedWeapon = shotgun(entity);
    return Object.assign(entity, entityProperties(entity));
}

let tntConstructor = (x, y) => {
    let entity = {
        name: "TNT",
        faction: "trap" + (x * 5 + y),
        background: true,
        health: 100,
        maxHealth: 100,
        x: x,
        y: y,
        speedX: 0,
        speedY: 0,
        width: 16,
        height: 16,
        image: assets.get("images/entities/placeholder-tnt.png"),
        imagePath: "images/entities/placeholder-tnt.png",
        aiState: "idle",
        aiGoalX: x,
        aiGoalY: y,
        framesIdle: 120,
        equippedWeapon: {},
        update: () => {
            entity.updateAI();
            entity.equippedWeapon.update();
        },
        updateAI: () => {
            if (entity.health < entity.maxHealth) {
                let targetIndex = entity.getClosestTargetIndex();
                entity.equippedWeapon.onFire(entities[targetIndex].x, entities[targetIndex].y);
                entity.health = 0;
            }
        },
    }
    entity.equippedWeapon = tntWeapon(entity);
    return Object.assign(entity, entityProperties(entity));
}

let entityConstructors = [wolfConstructor, grassTrapConstructor, sheepConstructor, crateConstructor, turretConstructor,
                            spikeConstructor, armorConstructor, tntConstructor];

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