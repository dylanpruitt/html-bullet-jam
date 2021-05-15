let player;
let mouseX;
let mouseY;
let keys;

let startGame = () => {
    generateMap();
    player = playerConstructor(10, 120);
    game.start();
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
        this.frameNo = 0;
        this.interval = setInterval(updateGame, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop : function() {
        clearInterval(this.interval);
    }
}

let updateEntities = () => {
    player.update();
    drawEntity(player, game.context);

    for (let i = 0; i < entities.length; i++) {
        drawEntity(entities[i], game.context);
        entities[i].update(player);
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

        if (player.collidingWith(bullets[i])) { 
            bullets[i].onCollide(player);
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
    game.frameNo++;
    game.clear();
    if (game.frameNo == 50) {
        drawMaskContext(game);
        game.frameNo = 0;
    }
    render(game);
    renderCrosshair();
    updateEntities();
    updateBullets();
    updatePlayerMovement();
    updateMaskContext();
}

let updateMaskContext = () => {
    let updateMask = false;
    if (player.x + xOffset > 160 && xOffset > (MAP_WIDTH * 16 - game.canvas.width) / 2) {
        xOffset -= Math.abs(player.speedX);
        updateMask = true;
    }
    if (player.y + yOffset > 160 && yOffset > (MAP_HEIGHT * 16 - game.canvas.height) / 2) {
        yOffset -= Math.abs(player.speedY);
        updateMask = true;
    }
    if (player.x + xOffset < 80 && xOffset < 0) {
        xOffset += Math.abs(player.speedX);
        updateMask = true;
    }
    if (player.y + yOffset < 80 && yOffset < 0) {
        yOffset += Math.abs(player.speedY);
        updateMask = true;
    }
    if (updateMask) {
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
});

document.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});
