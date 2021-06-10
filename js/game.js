let player;
let mouseX;
let mouseY;
let keys;
let autofire = false;
let inventory;

let startGame = () => {
    loadAssets();
    let interval = setInterval(() => {
        if (imagesLoaded < totalImages) {
            console.log(" >> " + imagesLoaded + "/" + totalImages);
        } else {
            clearInterval(interval);
            player = playerConstructor(spawnX, spawnY);
            entities.push(player);
            generateMap();
            inventory = [basicWeapon(player), shotgun(player), switcherooWeapon(player)];
            game.start();
            drawMaskContext(game);
        }
    }, 20);
}

let game = {
    canvas : document.createElement("canvas"),
    maskCanvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 480;
        this.canvas.height = 480;
        this.maskCanvas.width = this.canvas.width / 2;
        this.maskCanvas.height = this.canvas.height / 2;
        mouseX = 0;
        mouseY = 0;
        this.context = this.canvas.getContext("2d");
        this.context.scale(SCALE, SCALE);
        this.maskContext = this.maskCanvas.getContext('2d');
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGame, 20);
        this.paused = false;
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

let updateEntities = () => {
    for (let i = 0; i < entities.length; i++) {
        drawEntity(entities[i], game.context);
        entities[i].update();
    }

    removeDeadEntities();
}

let removeDeadEntities = () => {
    let temp = [];
    for (let i = 0; i < entities.length; i++) {
        if (entities[i].health > 0) {
            temp.push(entities[i]);   
        }
    }
    entities = temp;
}

let updateBullets = () => {
    ctx = game.context;
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].framesActive < bullets[i].maxFramesActive) {
            drawEntity(bullets[i], game.context);
            bullets[i].update();    
        }

        for (let j = 0; j < entities.length; j++) {
            if (entities[j].collidingWith(bullets[i])) { 
                bullets[i].onCollide(entities[j]);
            }
        }

        for (let j = 0; j < boundingBoxes.length; j++) {
            if (entityCollidingWithBounds(bullets[i], boundingBoxes[j])) {
                bullets[i].framesActive = bullets[i].maxFramesActive;
            }
        }
    }

    removeDeadBullets();
}

let removeDeadBullets = () => {
    let temp = [];
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].framesActive < bullets[i].maxFramesActive) {
            temp.push(bullets[i]);   
        }
    }
    bullets = temp;
}         

function updateGame() {
    if (imagesLoaded == totalImages && !game.paused) {
        game.clear();
        render(game);
        renderCrosshair();
        renderPlayerHealth(game);
        renderPlayerWeapons();
        updateEntities();
        updateBullets();
        updatePlayerMovement();
        updateMaskContext();
        updateMapTransitions();
        stopGameOnPlayerDeath();
        updatePlayerAutofire();
    }
}

let updatePlayerAutofire = () => {
    if (player.equippedWeapon.cooldownFrames == 0 && autofire) {
        player.equippedWeapon.onFire(mouseX - xOffset, mouseY - yOffset);
    }
}

let stopGameOnPlayerDeath = () => {
    if (player.health <= 0) {
        game.clear();
        game.context.font = "bold 24px Arial";
        game.context.fillText("YOU DIED", 15, 135);
        game.stop();
    }
}

let updateMapTransitions = () => {
    for (let i = 0; i < transitionBoxes.length; i++) {
        if (entityCollidingWithBounds(player, transitionBoxes[i])) {
            transitionToMap(transitionBoxes[i].path);
        }
    }
}

let updateMaskContext = () => {
    let updateMask = false;
    if (player.x + xOffset > 160 && xOffset > -(MAP_WIDTH * TILE_SIZE * SCALE - game.canvas.width) / 2) {
        xOffset -= Math.abs(player.speedX);
        updateMask = true;
    }
    if (player.y + yOffset > 160 && yOffset > -(MAP_HEIGHT * TILE_SIZE * SCALE - game.canvas.height) / 2) {
        yOffset -= Math.abs(player.speedY);
        updateMask = true;
    }
    if (player.x + xOffset < 80 && xOffset < 0) {
        xOffset += Math.abs(player.speedX);
        updateMask = true;
        if (xOffset > 0) { xOffset = 0; }
    }
    if (player.y + yOffset < 80 && yOffset < 0) {
        yOffset += Math.abs(player.speedY);
        updateMask = true;
        if (yOffset > 0) { yOffset = 0; }
    }
    if (updateMask && (player.speedX !== 0 || player.speedY !== 0)) {
        drawMaskContext(game);
    }
}           

let renderCrosshair = () => {
    let cursorDist = getCursorDistanceFromPlayer();
    let imagePath;

    if (cursorDist <= player.equippedWeapon.range) {
        imagePath = "images/crosshair.png";
    } else {
        imagePath = "images/crosshair_invalid.png";
    }

    let ctx = game.context;
    let image = new Image();
    image.src = imagePath;
    ctx.drawImage(image, 
        mouseX, 
        mouseY,
        image.width, 
        image.height);
}

let renderPlayerWeapons = () => {
    game.context.font = "bold 8px Arial";
    game.context.fillText(player.equippedWeapon.name, 5, 205);

    let previousIndex = player.activeWeaponIndex - 1; if (previousIndex < 0) { previousIndex = inventory.length - 1; }
    let nextIndex = player.activeWeaponIndex + 1; if (nextIndex >= inventory.length) { nextIndex = 0; }

    game.context.font = "6px Arial";
    game.context.fillText("[Q] " + inventory[previousIndex].name, 5, 195);
    game.context.fillText("[E] " + inventory[nextIndex].name, 5, 215);
}

let getCursorDistanceFromPlayer = () => {
    let xDist = player.x - (mouseX - xOffset);
    let yDist = player.y - (mouseY - yOffset);
    return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
}           
        
function getCursorPosition(event) {
    const rect = game.canvas.getBoundingClientRect();
    const x = Math.floor((event.clientX - rect.left) / SCALE);
    const y = Math.floor((event.clientY - rect.top) / SCALE);
    mouseX = x;
    mouseY = y;
}

let updatePlayerMovement = () => {
    if (keys == null) { return; }
    
    let A = 65, a = 97;
    let W = 87, w = 119;
    let S = 83, s = 115;
    let D = 68, d = 100;

    if (keys[A] || keys[a]) {
        if (player.speedX > 1) {
            player.speedX -= 0.7;
        } else {
            player.speedX -= 0.3;
        }
        if (player.speedX < player.speedCap * -1) {
            player.speedX = player.speedCap * -1;
        }
        if (player.x < 0) {
            player.x = 0;
            player.speedX = 0;
        }
    }
    if (keys[D] || keys[d]) {
        if (player.speedX < -1) {
            player.speedX += 0.7;
        } else {
            player.speedX += 0.3;
        }
        if (player.speedX > player.speedCap) {
            player.speedX = player.speedCap;
        }
        if (player.x > 16 * MAP_WIDTH - 6) {
            player.x = 16 * MAP_WIDTH - 6;
            player.speedX = 0;
        }
    }
    if (keys[W] || keys[w]) {
        if (player.speedY > 1) {
            player.speedY -= 0.7;
        } else {
            player.speedY -= 0.3;
        }
        if (player.speedY < player.speedCap * -1) {
            player.speedY = player.speedCap * -1;
        }
        if (player.y < 0) {
            player.y = 0;
            player.speedY = 0;
        }
    }
    if (keys[S] || keys[s]) {
        if (player.speedY < -1) {
            player.speedY += 0.7;
        } else {
            player.speedY += 0.3;
        }
        if (player.speedY > player.speedCap) {
            player.speedY = player.speedCap;
        }
        if (player.y > 16 * MAP_HEIGHT - 8) {
            player.y = 16 * MAP_HEIGHT - 8;
            player.speedY = 0;
        }
    }
}            

let loadMap = (path) => {
    $.getJSON(path, function(data) {
        console.log("data: " + data);
        spawnX = data.spawnX;
        player.x = spawnX;
        spawnY = data.spawnY;
        player.y = spawnY;
        MAP_WIDTH = data.MAP_WIDTH;
        MAP_HEIGHT = data.MAP_HEIGHT;
        xOffset = Math.floor(spawnX / 240) * -240;
        if (xOffset < 0 && xOffset < -(MAP_WIDTH * TILE_SIZE * SCALE - game.canvas.width) / 2) {
            xOffset = -(MAP_WIDTH * TILE_SIZE * SCALE - game.canvas.width) / 2;
        }
        yOffset = Math.floor(spawnY / 240) * -240; 
        if (yOffset < 0 && yOffset < -(MAP_HEIGHT * TILE_SIZE * SCALE - game.canvas.height) / 2) {
            yOffset = -(MAP_HEIGHT * TILE_SIZE * SCALE - game.canvas.height) / 2;
        }
        tileArray = data.tiles;
        totalImages = tileArray.length;
        for (let i = 0; i < tileArray.length; i++) {
            tileArray[i].image = new Image();
            tileArray[i].image.addEventListener("load", function() {
                imagesLoaded++;
            }, false);
            tileArray[i].image.src = tileArray[i].imagePath;
        }
        boundingBoxes = data.boxes;
        transitionBoxes = data.transitionBoxes;
        entities = data.entities;
        entities.unshift(player);
        for (let i = 0; i < entities.length; i++) {
            let index = getEntityConstructorIndexFromName(entities[i].name);
            if (index !== -1) {
                entities[i] = entityConstructors[index](entities[i].x, entities[i].y);
            }
        }
    });    
}

let transitionToMap = (newMapPath) => {
    game.paused = true;

    imagesLoaded = 0;
    loadMap(newMapPath);
    interval = setInterval(() => {
        if (imagesLoaded < totalImages) {
            console.log(" >> " + imagesLoaded + "/" + totalImages);
            game.clear();
            game.context.font = "bold 24px Arial";
            game.context.fillText("LOADING " + imagesLoaded + "/" + totalImages, 5, 135);
        } else {
            clearInterval(interval);
            game.paused = false;
            drawMaskContext(game);
        }
    }, 20);                
}
            
game.canvas.addEventListener("mousemove", function(e) {
    getCursorPosition(e);
});

let fireWeapon = (e) => {
    getCursorPosition(e);
    if (player.equippedWeapon.cooldownFrames == 0) {
        player.equippedWeapon.onFire(mouseX - xOffset, mouseY - yOffset);
    }
}

game.canvas.addEventListener("click", fireWeapon);

$('html').keydown(function(e) {
    keys = (keys || []);
    keys[e.keyCode] = true;

    let Q = 81, q = 113;
    let E = 69, lower_e = 101;
    let R = 82, r = 114;

    if(keys[Q] || keys[q]) {
        if (player.activeWeaponIndex == 0) {
            player.activeWeaponIndex = inventory.length - 1;
        } else {
            player.activeWeaponIndex--;
        }

        player.equippedWeapon = inventory[player.activeWeaponIndex];
        game.context.font = "14px Arial";
        console.log(player.equippedWeapon.name);
    }

    if(keys[E] || keys[lower_e]) {
        if (player.activeWeaponIndex == inventory.length - 1) {
            player.activeWeaponIndex = 0;
        } else {
            player.activeWeaponIndex++;
        }

        player.equippedWeapon = inventory[player.activeWeaponIndex];
        game.context.font = "14px Arial";
        console.log(player.equippedWeapon.name);
    }

    if (keys[R] || keys[r]) {
        autofire = !autofire;
    }
});

document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
