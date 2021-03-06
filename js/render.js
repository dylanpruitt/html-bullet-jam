let xOffset = Math.floor(spawnX / 240) * -80;
let yOffset = Math.floor(spawnY / 240) * -80;

let drawEntity = (entity, ctx) => {
    ctx.drawImage(entity.image, 
        entity.x + xOffset, 
        entity.y + yOffset,
        entity.width, 
        entity.height);
}

let render = function (game) {
    let ctx = game.context;
    ctx.drawImage(game.maskCanvas, 0, 0);
}

let renderPlayerHealth = (game) => {
    game.context.font = "bold 7px Arial";
    if (player.health / player.maxHealth <= 0.25) {
        game.context.fillStyle = "#ff0000";
    } else {
        game.context.fillStyle = "#ffffff";
    }
    let textWidth = game.context.measureText(player.health).width;
    game.context.fillText(player.health, player.x + xOffset + (player.width - textWidth) / 2, player.y + 15 + yOffset);
}

let renderScreenText = (game) => {
    for (let i = 0; i < screenText.length; i++) {
        game.context.font = "bold " + screenText[i].fontSize + " Arial";
        game.context.fillStyle = screenText[i].color;
        game.context.globalAplha = screenText[i].opacity;
        game.context.fillText(screenText[i].message, screenText[i].x, screenText[i].y);
    }

    game.context.globalAplha = 1;
}

let drawMaskContext = (game) => {
    let t0 = performance.now();
    game.maskContext.clearRect(0, 0, game.maskCanvas.width, game.maskCanvas.height);

    let topLeftIndex = getTileIndexFromPosition(-xOffset, -yOffset);

    let renderBoxWidth = game.maskCanvas.width / TILE_SIZE + 1;
    let renderBoxHeight = game.maskCanvas.height / TILE_SIZE + 1;

    for (let i = 0; i < renderBoxHeight; i++) {
        for (let j = 0; j < renderBoxWidth; j++) {
            let index = topLeftIndex + j + i * MAP_WIDTH;
            if (index < tileArray.length) {
                if (tileArray[index] === undefined) {
                    console.log(topLeftIndex + " in");
                    console.log(xOffset + '\n' + yOffset);
                    console.log(index);
                }
                let image = tileArray[index].image;
                game.maskContext.drawImage(image, 
                    tileArray[index].x + xOffset, 
                    tileArray[index].y + yOffset,
                    image.width, 
                    image.height);  
            }
        }
    }

    let t1 = performance.now();
    console.log("drawing mask context took " + (t1 - t0) + "ms");
}

let getTileIndexFromPosition = (x, y) => {
    let xIndex = Math.floor(x / 16);
    let yIndex = Math.floor(y / 16);
    let index = yIndex * MAP_WIDTH + xIndex;
    return index;
}