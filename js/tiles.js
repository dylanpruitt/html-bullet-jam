let emptyTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/empty.png"),
        imagePath: "images/tiles/empty.png",
    }
    return tile;   
}

let grassTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/grass-tile-1.png"),
        imagePath: "images/tiles/grass-tile-1.png",
    }
    return tile;   
}

let grassTileShort = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/grass-tile-2.png"),
        imagePath: "images/tiles/grass-tile-2.png",
    }
    return tile;   
}

let grassTileTall = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/grass-tile-3.png"),
        imagePath: "images/tiles/grass-tile-3.png",
    }
    return tile;   
}

let rockTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: assets.get("images/tiles/rock-tile.png"),
        imagePath: "images/tiles/rock-tile.png",
    }
    return tile;   
}

let blendGrassSandTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/blend-grass-sand.png"),
        imagePath: "images/tiles/blend-grass-sand.png",
    }
    return tile;   
}

let sandTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/sand-tile-1.png"),
        imagePath: "images/tiles/sand-tile-1.png",
    } 
    return tile;   
}

let floorTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/floor-tile-1.png"),
        imagePath: "images/tiles/floor-tile-1.png",
    }
    return tile;   
}

let rockWallTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: assets.get("images/tiles/rock-wall-tile-1.png"),
        imagePath: "images/tiles/rock-wall-tile-1.png",
    }
    return tile;   
}

let wallTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: assets.get("images/tiles/wall-tile-1.png"),
        imagePath: "images/tiles/wall-tile-1.png",
    }
    return tile;   
}

let brickWallTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: assets.get("images/tiles/brick-wall-1.png"),
        imagePath: "images/tiles/brick-wall-1.png",
    }
    return tile;   
}

let brickWallTile2 = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: assets.get("images/tiles/brick-wall-2.png"),
        imagePath: "images/tiles/brick-wall-2.png",
    }
    return tile;   
}

let greenFloorTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/green-floor-tile.png"),
        imagePath: "images/tiles/green-floor-tile.png",
    }
    return tile;   
}

let waterFloorTile = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/floor-water.png"),
        imagePath: "images/tiles/floor-water.png",
    }
    return tile;   
}

let tileset = [emptyTile, grassTile, grassTileShort, grassTileTall, rockTile, blendGrassSandTile, sandTile,
                floorTile, rockWallTile, wallTile, brickWallTile, brickWallTile2, greenFloorTile, waterFloorTile];