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
    for (let i = 0; i < tileArray.length; i++) {
        let image = tileArray[i].image;
            game.maskContext.drawImage(image, 
                tileArray[i].x + xOffset, 
                tileArray[i].y + yOffset,
                image.width, 
                image.height);    
    }
}