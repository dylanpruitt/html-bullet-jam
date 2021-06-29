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

let qButton = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/q-button.png"),
        imagePath: "images/tiles/q-button.png",
    }
    return tile;   
}

let eButton = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/e-button.png"),
        imagePath: "images/tiles/e-button.png",
    }
    return tile;   
}

let dungeonFloor1 = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/dungeon-floor-1.png"),
        imagePath: "images/tiles/dungeon-floor-1.png",
    } 
    return tile;   
}

let dungeonFloor2 = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: false,
        image: assets.get("images/tiles/dungeon-floor-2.png"),
        imagePath: "images/tiles/dungeon-floor-2.png",
    }
    return tile;   
}

let dungeonWall1 = (x, y) => {
    let tile = {
        x: x,
        y: y,
        width: 16,
        height: 16,
        collidable: true,
        image: assets.get("images/tiles/dungeon-wall-1.png"),
        imagePath: "images/tiles/dungeon-wall-1.png",
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

let tileset = [emptyTile, grassTile, grassTileShort, grassTileTall, rockTile, qButton, eButton, dungeonFloor1,
                dungeonFloor2, dungeonWall1, wallTile, brickWallTile, brickWallTile2, greenFloorTile, waterFloorTile];