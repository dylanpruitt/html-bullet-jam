/**
 * The index of the user's selected tile (default is 0).
 * @type {number}
 */
let selection = 0;

/**
 * A string storing which mode the editor is currently in.
 * @type {string}
 */
let editorMode = "selection";

/**
 * A variable storing if "mouse lock" is on (prevents the camera from shifting
 *  when a user moves their mouse).
 * @type {number}
 */
let mouseLock = false;

/**
 * The maximum width/height a map can have, in tiles.
 * @type {number}
 */
let MAX_SIZE = 255;

/**
 * A variable storing marked tile indices.
 * @type {array}
 */
let markedIndices = [];

/**
 * This function sets up everything required for the map editor to function, 
 *  including the game loop and generating elements in HTML for user interface.
 */
let setupEditor = () => {
    generateMap();
    player = playerConstructor(spawnX, spawnY);
    game.start();
    setupTilePicker();
    clearInterval(game.interval);
    game.canvas.removeEventListener("click", fireWeapon);
    game.interval = setInterval(updateMap, 20);
}

/**
 * This function creates the "tile picker", and creates an element for each tile 
 *  inside of the DIV. When any of these elements is clicked, the editor will set
 *  the selected tile to whatever tile corresponds to the clicked element.
 */
let setupTilePicker = () => {
    $("#tile-picker").width("32px").height(game.canvas.height);
    for (let i = 0; i < tileset.length; i++) {
        let tileSelector = $("<div></div>").width("20px").height("20px");
        tileSelector.id = "tile-selector-" + i;
        tileSelector.className = "tile-selector";
        let tileImageSource = tileset[i]().image.src;
        let tileImage = $("<img></img>").attr("src", tileImageSource).width("20px").height("20px");
        tileImage.click(function () {
            console.log("Selected tile " + i);
            selection = i;
        });
        tileImage.appendTo(tileSelector);
        tileSelector.appendTo("#tile-picker");
    }
}

/**
 * This function updates the map every frame, and renders the map and entities onto
 *  the screen. If mouse lock is enabled, the function also renders text onto the 
 *  screen to notify the user that it is currently in use.
 */
let updateMap = () => {
    game.clear();
    if (game.frameNo == 50) {
        drawMaskContext(game);
        game.frameNo = 0;
    }
    render(game);
    renderCrosshair();
    updateMaskContext();
    renderEntities();
    if (mouseLock) {
        game.context.font = "8px Arial";
        game.context.fillText("MOUSE LOCK", 2, 235);
    }
}

/**
 * This function renders a crosshair to the screen, at the position of the user's
 *  mouse cursor.
 */
renderCrosshair = () => {
    let imagePath = "images/crosshair.png";

    let ctx = game.context;
    let image = new Image();
    image.src = imagePath;
    ctx.drawImage(image, 
        mouseX, 
        mouseY,
        image.width, 
        image.height);
}

/**
 * This function renders all of the entities in the game.
 */
let renderEntities = () => {
    for (let i = 0; i < entities.length; i++) {
        drawEntity(entities[i], game.context);
    }

    drawEntity(player, game.context);
}

/**
 * This function updates the x and y offsets of the camera, and redraws the mask
 *  context of the screen when the camera's x and y offsets are updated. Because
 *  the background does not change unless the camera's offsets change, it is only
 *  necessary to update the mask context when the offsets change.
 */
updateMaskContext = () => {
    if (!mouseLock) {
        let updateMask = false;
        if (mouseX > 180 && xOffset > -(MAP_WIDTH * TILE_SIZE * SCALE - game.canvas.width) / 2) {
            xOffset -= 2;
            updateMask = true;
        }
        if (mouseY > 180 && yOffset > -(MAP_HEIGHT * TILE_SIZE * SCALE - game.canvas.height) / 2) {
            yOffset -= 2;
            updateMask = true;
        }
        if (mouseX < 60 && xOffset < 0) {
            xOffset += 2;
            updateMask = true;
        }
        if (mouseY < 60 && yOffset < 0) {
            yOffset += 2;
            updateMask = true;
        }
        if (updateMask) {
            drawMaskContext(game);
        }
    }
    
}

/**
 * Gets the index of the tile the cursor is currently pointing at.
 * @returns {number} Index of selected tile
 */
let getTileIndexFromCursor = () => {
    let x = Math.floor((mouseX - xOffset)  / 16);
    let y = Math.floor((mouseY - yOffset) / 16);
    let index = y * MAP_WIDTH + x;
    return index;
}

/**
 * Resizes the map, based on the user's inputs for the new map size.
 */
let resizeMap = () => {
    let mapX = document.getElementById("map-size-x");
    let mapY = document.getElementById("map-size-y");
    let xSize = Number(mapX.value);
    let ySize = Number(mapY.value);
    
    if (xSize > 0 && ySize > 0 && xSize <= MAX_SIZE && ySize <= MAX_SIZE) {
        if (xSize < MAP_WIDTH && ySize < MAP_HEIGHT) {
            shrinkMap(xSize, ySize);
        }
        if (xSize > MAP_WIDTH && ySize <= MAP_HEIGHT) {
            shrinkMap(MAP_WIDTH, ySize);
            enlargeMap(xSize, ySize);
        }
        if (xSize <= MAP_WIDTH && ySize > MAP_HEIGHT) {
            shrinkMap(xSize, MAP_HEIGHT);
            enlargeMap(xSize, ySize);
        }
        if (xSize > MAP_WIDTH && ySize > MAP_HEIGHT) {
            enlargeMap(xSize, ySize);
        }
    }
}

/**
 * Creates a new array of tiles for the map, filling in new space with
 *  empty tiles.
 * @param {number} newXSize The new width of the map, in tiles.
 * @param {number} newYSize The new height of the map, in tiles.
 */
let enlargeMap = (newXSize, newYSize) => {
    let temp = [];

    for (let y = 0; y < MAP_HEIGHT; y++) {
        for (let x = 0; x < MAP_WIDTH; x++) {
            let index = y * MAP_WIDTH + x;
            temp.push(tileArray[index]);
        }
        for (let x = MAP_WIDTH; x < newXSize; x++) {
            temp.push(emptyTile(x * 16, y * 16));
        }
    }

    for (let y = MAP_HEIGHT; y < newYSize; y++) {
        for (let x = 0; x < newXSize; x++) {
            temp.push(emptyTile(x * 16, y * 16));
        }
    }

    tileArray = temp;
    MAP_WIDTH = newXSize;
    MAP_HEIGHT = newYSize;
}

/**
 * Creates a new array of tiles for the map, removing unused map space.
 * @param {number} newXSize The new width of the map, in tiles.
 * @param {number} newYSize The new height of the map, in tiles.
 */
let shrinkMap = (newXSize, newYSize) => {
    let temp = [];

    for (let y = 0; y < newYSize; y++) {
        for (let x = 0; x < newXSize; x++) {
            let index = y * MAP_WIDTH + x;
            temp.push(tileArray[index]);
        }
    }

    tileArray = temp;
    MAP_WIDTH = newXSize;
    MAP_HEIGHT = newYSize;
}

game.canvas.addEventListener("click", function(e) {
    getCursorPosition(e);

    let x = Math.floor((mouseX - xOffset) / 16) * 16;
    let y = Math.floor((mouseY - yOffset) / 16) * 16;

    if (editorMode === "selection") {
        let selection = tileArray[getTileIndexFromCursor()];
        let infoMessage = "SELECTED TILE:<br>X: " + selection.x + ", Y: " + selection.y + "<br>COLLIDABLE: " + selection.collidable;
        $("#tile-info").html(infoMessage);
        if (document.getElementById("set-spawn")) {
            $("#set-spawn").remove();
        }

        let tileDIV = document.getElementById("selection-info");
        let setSpawn = document.createElement("button");
        setSpawn.id = "set-spawn";
        setSpawn.innerHTML = "Set player spawn here";
        setSpawn.onclick = function() { 
            setSpawnTile(selection);
            drawMaskContext(game);
        };
        tileDIV.appendChild(setSpawn);

        let entityIndex = getSelectedEntity();
        if (entityIndex > -1) {
            createEntitySelectionDIV(entityIndex);
        }
    } else if (editorMode === "tileEdit") {
        tileArray[getTileIndexFromCursor()] = tileset[selection](x, y);
        drawMaskContext(game);
    } else if (editorMode === "tileFill") {
        markedIndices.push(getTileIndexFromCursor());

        if (markedIndices.length == 2) {
            tileFill(markedIndices[0], markedIndices[1], selection);
            drawMaskContext(game);
            markedIndices = [];
            editorMode = "selection";
        }
    } else if (editorMode === "entityEdit") {
        x = mouseX - xOffset;
        y = mouseY - yOffset;
        entities.push(wolfConstructor(x, y));
    }
});

/**
 * Sets the player's spawn coordinates centered on this tile.
 * @param {object} tile The tile where the player will spawn.
 */
let setSpawnTile = (tile) => {
    spawnX = tile.x + (TILE_SIZE - player.width) / 2;
    spawnY = tile.y + (TILE_SIZE - player.height) / 2;
    player.x = spawnX;
    player.y = spawnY;
}

/**
 * Fills in a rectangle from topLeftIndex to bottomRightIndex with certain tiles, specified
 *  by tilesetIndex.
 * @param {number} topLeftIndex 
 * @param {number} bottomRightIndex
 * @param {number} tilesetIndex 
 */
let tileFill = (topLeftIndex, bottomRightIndex, tilesetIndex) => {
    let xDifference = (tileArray[bottomRightIndex].x - tileArray[topLeftIndex].x) / 16 + 1;
    let yDifference = (tileArray[bottomRightIndex].y - tileArray[topLeftIndex].y) / 16 + 1;

    for (let i = 0; i < yDifference; i++) {
        for (let j = 0; j < xDifference; j++) {
            let index = topLeftIndex + (i * MAP_WIDTH) + j;
            let x = index % MAP_WIDTH * TILE_SIZE;
            let y = Math.floor(index / MAP_WIDTH) * TILE_SIZE;
            tileArray[index] = tileset[tilesetIndex](x, y);
        }
    }
}

/**
 * Creates a new HTML element containing information about the selected entity.
 * @param {number} entityIndex 
 */
let createEntitySelectionDIV = (entityIndex) => {
    if (document.getElementById("selected-entity-info")) {
        document.body.removeChild(document.getElementById("selected-entity-info"));
    }

    let entityDIV = document.createElement("div");
    entityDIV.id = "selected-entity-info";
    document.body.appendChild(entityDIV);

    let entityInfo = document.createElement("p");
    let entity = entities[entityIndex];
    entityInfo.innerHTML = entity.name + " @ " + entity.x + ", " + entity.y + "<br>Health: " + entity.health;
    entityDIV.appendChild(entityInfo);

    let deleteEntity = document.createElement("button");
    deleteEntity.innerHTML = "Delete entity";
    deleteEntity.onclick = function() { 
        entities.splice(entityIndex, 1);
        document.body.removeChild(document.getElementById("selected-entity-info"));
    };
    entityDIV.appendChild(deleteEntity);
}

/**
 * Gets the entity at the cursor position, or returns -1 if no entity is there.
 * @returns {number} Index of selected entity, or -1 if no entity exists at the cursor position
 */
let getSelectedEntity = () => {
    let NONE_SELECTED = -1;
    for (let i = 0; i < entities.length; i++) {
        if (mouseX - xOffset >= entities[i].x && mouseX - xOffset <= entities[i].x + entities[i].width
&& mouseY - yOffset >= entities[i].y && mouseY - yOffset <= entities[i].y + entities[i].height) {
    return i;
}
    }
    return NONE_SELECTED;
}

/**
 * Sets the mouse lock if M/m is pressed on the keyboard.
 */
$('html').keydown(function(e) {
    keys = (keys || []);
    keys[e.keyCode] = true;

    let F = 70, f = 102;
    let M = 77, m = 109;

    if (keys[F] || keys[f]) {
        if (editorMode === "tileFill") {
            setEditorMode("selection");
        } else {
            setEditorMode("tileFill");
        }
    }
    if (keys[M] || keys[m]) {
        mouseLock = !mouseLock;
    }
});

/**
 * Sets the mode that the editor is currently in.
 * @param {string} mode Mode to set editor to
 */
let setEditorMode = (mode) => {
    editorMode = mode;
}