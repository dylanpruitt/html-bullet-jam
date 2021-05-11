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
            let image = tileArray[i * MAP_WIDTH + j].image;
            game.maskContext.drawImage(image, 
                i * image.width + xOffset, 
                j * image.height + yOffset,
                image.width, 
                image.height);
        }
    }
}