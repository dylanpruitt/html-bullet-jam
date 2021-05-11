let player;
        let mouseX;
        let mouseY;
        let keys;
        function startGame() {
            player = playerConstructor(10, 120);
            myGameArea.start();
        }
        
        var myGameArea = {
            canvas : document.createElement("canvas"),
            maskCanvas : document.createElement("canvas"),
            start : function() {
                this.canvas.width = 480;
                this.canvas.height = 480;
                this.maskCanvas.width = this.canvas.width / 2;
                this.maskCanvas.height = this.canvas.height / 2;
                mouseX = player.x;
                mouseY = player.y;
                this.context = this.canvas.getContext("2d");
                this.context.scale(SCALE, SCALE);
                this.maskContext = this.maskCanvas.getContext('2d');
                document.body.insertBefore(this.canvas, document.body.childNodes[0]);
                this.frameNo = 0;
                this.interval = setInterval(updateGameArea, 20);
            },
        
            clear : function() {
                this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
            },
            stop : function() {
                clearInterval(this.interval);
            }
        }
let xOffset = 0;
let yOffset = 0;

let drawEntity = (entity) => {
    ctx = myGameArea.context;
    ctx.drawImage(entity.image, 
        entity.x + xOffset, 
        entity.y + yOffset,
        entity.width, 
        entity.height);
}

entities.push(wolfConstructor(150, 150));

let updateEntities = () => {
    drawEntity(player);
    player.update();

    for (let i = 0; i < entities.length; i++) {
        drawEntity(entities[i]);
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
    ctx = myGameArea.context;
    for (let i = 0; i < bullets.length; i++) {
        if (bullets[i].framesActive < bullets[i].maxFramesActive) {
            ctx.drawImage(bullets[i].image, 
                bullets[i].x + xOffset, 
                bullets[i].y + yOffset,
                bullets[i].width, 
                bullets[i].height);
            bullets[i].update();    
        }

        for (let j = 0; j < entities.length; j++) {
            if (entities[j].collidingWith(bullets[i])) { 
                bullets[i].onCollide(entities[j]);
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

function updateGameArea() {
    myGameArea.frameNo++;
    myGameArea.clear();
    if (myGameArea.frameNo == 50) {
        drawMaskContext();
        myGameArea.frameNo = 0;
    }
    render(xOffset,yOffset);
    renderCrosshair();
    updateEntities();
    updateBullets();
    updatePlayerMovement();
    updateMaskContext();
}

            let render = function (xOffset, yOffset) {
                let ctx = myGameArea.context;
                ctx.drawImage(myGameArea.maskCanvas, 0, 0);
            }

            let drawMaskContext = () => {
                myGameArea.maskContext.clearRect(0, 0, myGameArea.maskCanvas.width, myGameArea.maskCanvas.height);
            for (let i = 0; i < MAP_WIDTH; i++) {
                    for (let j = 0; j < MAP_WIDTH; j++) {
                        let imagePath = "images/tiles/grass-tile-" + tileArray[j * MAP_WIDTH + i] + ".png";
                        let image = new Image();
                        image.src = imagePath;
                        myGameArea.maskContext.drawImage(image, 
                            j * image.width + xOffset, 
                            i * image.height + yOffset,
                            image.width, 
                            image.height);
                    }
                }
        }

            let updateMaskContext = () => {
                let updateMask = false;
                if (player.x > 200 && xOffset > (MAP_WIDTH * 16 - myGameArea.canvas.width) / 2) {
                    xOffset -= 0.5;
                    updateMask = true;
                }
                if (player.y > 200 && yOffset > (MAP_WIDTH * 16 - myGameArea.canvas.height) / 2) {
                    yOffset -= 0.5;
                    updateMask = true;
                }
                if (player.x < 40 && xOffset < 0) {
                    xOffset += 0.5;
                    updateMask = true;
                }
                if (player.y < 40 && yOffset < 0) {
                    yOffset += 0.5;
                    updateMask = true;
                }
                if (updateMask) {
                    drawMaskContext();
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

                let ctx = myGameArea.context;
                let image = new Image();
                image.src = imagePath;
                ctx.drawImage(image, 
                    mouseX, 
                    mouseY,
                    image.width, 
                    image.height);
            }

            let getCursorDistanceFromPlayer = () => {
                let xDist = player.x - mouseX;
                let yDist = player.y - mouseY;
                return Math.sqrt(Math.pow(xDist, 2) + Math.pow(yDist, 2));
            }
        
            function getCursorPosition(event) {
                const rect = myGameArea.canvas.getBoundingClientRect();
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
                    if (player.y > 16 * MAP_WIDTH - 8) {
                        player.y = 16 * MAP_WIDTH - 8;
                        player.speedY = 0;
                    }
                }
            }

            myGameArea.canvas.addEventListener("mousemove", function(e) {
                getCursorPosition(e);
            });
            myGameArea.canvas.addEventListener("click", function(e) {
                getCursorPosition(e);
                if (player.equippedWeapon.cooldownFrames == 0) {
                    player.equippedWeapon.onFire(mouseX, mouseY);
                }
            });

            $('html').keydown(function(e) {
                keys = (keys || []);
                keys[e.keyCode] = true;
            });

            document.addEventListener("keyup", function (e) {
                keys[e.keyCode] = false;
            });