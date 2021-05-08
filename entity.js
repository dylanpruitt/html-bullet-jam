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
        }
    }
    entity.image.src = "player.png";
    return entity;
}

let wolfConstructor = (x, y) => {
    let entity = {
        name: "Wolf",
        health: 24,
        maxHealth: 24,
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
        update: () => {
            entity.updateAI();
            entity.updatePosition();
        },
        updatePosition: () => {
            entity.x += entity.speedX;
            entity.y += entity.speedY;
        },
        updateAI: () => {
            entity.idleAI();
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
            if (Math.abs(entity.x - entity.aiGoalX) <= 1) { 
                entity.x = entity.aiGoalX; 
                entity.speedX = 0;
            }
            if (Math.abs(entity.y - entity.aiGoalY) <= 1) { 
                entity.y = entity.aiGoalY; 
                entity.speedY = 0;
            }
            if (entity.x > entity.aiGoalX) { entity.speedX = -1; }
            if (entity.y > entity.aiGoalY) { entity.speedY = -1; }
            if (entity.x < entity.aiGoalX) { entity.speedX = 1; }
            if (entity.y < entity.aiGoalY) { entity.speedY = 1; }
        },
        chaseAI: () => {
            
        }

    }
    entity.image.src = "wolf.png";
    return entity;   
}