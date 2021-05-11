let xOffset = 0;
let yOffset = 0;

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

let drawMaskContext = (game) => {
    game.maskContext.clearRect(0, 0, game.maskCanvas.width, game.maskCanvas.height);
    for (let i = 0; i < MAP_WIDTH; i++) {
        for (let j = 0; j < MAP_WIDTH; j++) {
            let imagePath = "images/tiles/grass-tile-" + tileArray[j * MAP_WIDTH + i] + ".png";
            let image = new Image();
            image.src = imagePath;
            game.maskContext.drawImage(image, 
                j * image.width + xOffset, 
                i * image.height + yOffset,
                image.width, 
                image.height);
        }
    }
}