let emptyTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: new Image(),
        imagePath: "images/tiles/empty.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/grass-tile-1.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/grass-tile-2.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/grass-tile-3.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/rock-tile.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/blend-grass-sand.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/sand-tile-1.png",
    } 
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/floor-tile-1.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/rock-wall-tile-1.png",
    }
    tile.image.src = tile.imagePath;
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
        imagePath: "images/tiles/wall-tile-1.png",
    }
    tile.image.src = tile.imagePath;
    return tile;   
}

let tileset = [emptyTile, grassTile, grassTileShort, grassTileTall, rockTile, blendGrassSandTile, sandTile,
                floorTile, rockWallTile, wallTile];