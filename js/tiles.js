let emptyTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/empty.png";
    return tile;   
}

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

let blendGrassSandTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/blend-grass-sand.png";
    return tile;   
}

let sandTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/sand-tile-1.png";
    return tile;   
}

let floorTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/floor-tile-1.png";
    return tile;   
}

let rockWallTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: new Image(),
    }
    tile.image.src = "images/tiles/rock-wall-tile-1.png";
    return tile;   
}

let wallTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
    }
    tile.image.src = "images/tiles/wall-tile-1.png";
    return tile;   
}

let tileset = [emptyTile, grassTile, grassTileShort, grassTileTall, rockTile, blendGrassSandTile, sandTile,
                floorTile, rockWallTile, wallTile];