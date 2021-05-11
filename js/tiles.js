let grassTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/grass-tile-1.png";
    return tile;   
}

let grassTileShort = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/grass-tile-2.png";
    return tile;   
}

let grassTileTall = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/grass-tile-3.png";
    return tile;   
}

let rockTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: new Image(),
    }
    tile.image.src = "images/tiles/rock-tile.png";
    return tile;   
}

let tileset = [grassTile, grassTileShort, grassTileTall, rockTile];