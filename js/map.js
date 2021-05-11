let tileArray = [
    3, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2,
    3, 3, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 2, 2, 2, 
    1, 2, 2, 1, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 2, 2, 2, 2, 2,
    1, 2, 1, 1, 0, 0, 0, 1, 1, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2,
    0, 1, 1, 0, 0, 3, 1, 1, 0, 0, 0, 0, 0, 1, 0, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 0, 1, 0, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0, 2, 2, 2, 2, 2,
    0, 0, 0, 1, 2, 1, 0, 0, 1, 1, 0, 1, 2, 1, 0, 2, 2, 2, 2, 2,
    0, 0, 1, 1, 2, 2, 1, 1, 2, 2, 1, 0, 1, 0, 0, 2, 2, 2, 2, 2,
    0, 0, 0, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 2, 2, 2, 2,
    0, 0, 1, 0, 0, 3, 0, 0, 1, 1, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2,
    0, 0, 0, 0, 1, 1, 0, 1, 2, 2, 2, 1, 0, 0, 1, 2, 2, 2, 2, 2,
    1, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 0, 0, 1, 2, 2, 2, 2, 2, 2,
    2, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1, 2, 2, 0, 0, 0, 0,
    1, 0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 0, 0,
    1, 0, 0, 1, 1, 2, 2, 2, 1, 1, 0, 0, 0, 0, 0, 1, 2, 2, 1, 0,
    0, 0, 0, 1, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 1, 2, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 2, 1, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0,
];
let boundingBoxes = [];

let MAP_WIDTH = 20;
let TILE_SIZE = 16;
let SCALE = 2;

let entityCollidingWithBounds = (entity, bounds) => {
    let entityLeftOfBounds = (entity.x + entity.width) < bounds.minX;
    let entityRightOfBounds = entity.x > bounds.maxX;
    let entityAboveBounds = entity.y > bounds.maxY;
    let entityBelowBounds = (entity.y + entity.height) < bounds.minY;

    return !( entityLeftOfBounds || entityRightOfBounds || entityAboveBounds || entityBelowBounds );
}

let generateMap = () => {
    for (let i = 0; i < tileArray.length; i++) {
        tileArray[i] = tileset[tileArray[i]]();
    }
    boundingBoxes = generateBoundGroups(tileArray);
}

/**
 * This function takes an array of collision values (0/false or 1/true) to create optimized
 * bounding boxes for tile collision. The function creates basic bounding boxes, and then op-
 * timizes them by merging adjacent bounds and removing redundant bounding boxes.
 * @param {array} tileArray 
 * @returns optimized bounding boxes
 */
 let generateBoundGroups = (tileArray) => {
    let t0 = performance.now();

    let boundGroups = generateBasicBounds(tileArray);
    let boundingBoxes = createBoundingBoxes(boundGroups);

    boundingBoxes = optimizedMerge(boundingBoxes);
    boundingBoxes = optimizedUnique(boundingBoxes);

    let t1 = performance.now();
    console.log("generating bounding boxes took " + (t1 - t0) + "ms");
    return boundingBoxes;
}

let optimizedMerge = (boundingBoxes) => {
    while (groupsCanBeMerged(boundingBoxes)) {
        for (let i = 0; i < boundingBoxes.length; i++) {
            for (let j = 0; j < boundingBoxes.length; j++) {
                if (i != j && groupsAreMergeable(boundingBoxes[i], boundingBoxes[j])) {
                    if (boundingBoxes[i].minY == boundingBoxes[j].minY
                        && boundingBoxes[i].maxX == boundingBoxes[j].minX) {
                            boundingBoxes[i].maxX = boundingBoxes[j].maxX;
                            boundingBoxes[j].width = -1;
                    }
                    if (boundingBoxes[i].minY == boundingBoxes[j].minY
                        && boundingBoxes[j].maxX == boundingBoxes[i].minX) {
                            boundingBoxes[i].minX = boundingBoxes[j].minX;
                            boundingBoxes[j].width = -1;
                    }
                    if (boundingBoxes[i].minX == boundingBoxes[j].minX
                        && boundingBoxes[i].maxY == boundingBoxes[j].minY) {
                            boundingBoxes[i].maxY = boundingBoxes[j].maxY;
                            boundingBoxes[j].width = -1;
                    }
                    if (boundingBoxes[i].minX == boundingBoxes[j].minX
                        && boundingBoxes[j].maxY == boundingBoxes[i].minY) {
                            boundingBoxes[i].minY = boundingBoxes[j].minY;
                            boundingBoxes[j].width = -1;
                    }
                }
            }
        }
    }

    boundingBoxes = updatedGroups(boundingBoxes);
    return boundingBoxes;
}

let optimizedUnique = (boundingBoxes) => {
    while (redundantGroupsExist(boundingBoxes)) {
        for (let i = 0; i < boundingBoxes.length; i++) {
            for (let j = 0; j < boundingBoxes.length; j++) {
                if (i != j && groupsAreRedundant(boundingBoxes[i], boundingBoxes[j])
                    && boundingBoxes[i].width != -1 && boundingBoxes[j].width != -1) {
                    boundingBoxes[i].width = -1;
                }
            }
        }

        boundingBoxes = updatedGroups(boundingBoxes);
    }
    return boundingBoxes;
}

let updatedGroups = (boundingBoxes) => {
    let temp = [];
    for (let i = 0; i < boundingBoxes.length; i++) {
        if (boundingBoxes[i].width != -1) {
            boundingBoxes[i].width = boundingBoxes[i].maxX - boundingBoxes[i].minX;
            boundingBoxes[i].height = boundingBoxes[i].maxY - boundingBoxes[i].minY;
            temp.push(boundingBoxes[i]);
        }
    }
    return temp;
}

let generateBasicBounds = (tileArray) => {
    let boundGroups = [];
    let currentBounds = [];

    for (let i = 0; i < MAP_WIDTH; i++) {
        for (let j = 0; j < MAP_WIDTH; j++) {
            let index = i * MAP_WIDTH + j;
            if (tileArray[index].collidable == 1) {
                currentBounds.push(index);
                if (j == MAP_WIDTH - 1 || tileArray[index + 1].collidable == 0) {
                    boundGroups.push(currentBounds);
                    currentBounds = [];
                }
            }
        }
    }

    for (let i = 0; i < MAP_WIDTH; i++) {
        for (let j = 0; j < MAP_WIDTH; j++) {
            let index = j * MAP_WIDTH + i;
            if (tileArray[index].collidable == 1) {
                currentBounds.push(index);
                if (j == MAP_WIDTH - 1 || tileArray[index + MAP_WIDTH].collidable == 0) {
                    boundGroups.push(currentBounds);
                    currentBounds = [];
                }
            }
        }
    }

    return boundGroups;
}

let createBoundingBoxes = (groups) => {
    let boxes = [];
    for (let i = 0; i < groups.length; i++) {
        boxes.push(createBoundingBox(groups[i]));
    }
    return boxes;
}

let createBoundingBox = (group) => {
    let box = {};
    let boundIndices = getMinAndMaxIndices(group);
    let min = group[boundIndices[0]], max = group[boundIndices[1]];
    box.minX = Math.floor(min / MAP_WIDTH) * TILE_SIZE;
    box.maxX = (Math.floor(max / MAP_WIDTH) + 1) * TILE_SIZE;
    box.minY = min % MAP_WIDTH * TILE_SIZE;
    box.maxY = (max % MAP_WIDTH + 1) * TILE_SIZE;
    box.width = box.maxX - box.minX;
    box.height = box.maxY - box.minY;
    return box;
}

let getMinAndMaxIndices = (group) => {
    let min = 100000, max = -1;
    let minIndex = 0, maxIndex = 0;
    for (let i = 0; i < group.length; i++) {
        if (group[i] < min) {
            min = group[i];
            minIndex = i;
        }
        if (group[i] > max) {
            max = group[i];
            maxIndex = i;
        }
    }
    return [minIndex, maxIndex];
}

let groupsCanBeMerged = (groups) => {
    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups.length; j++) {
            if (i != j) {
                if (groupsAreMergeable(groups[i], groups[j])) {
                    return true;
                }
            }
        }
    }

    return false;
}

let groupsAreMergeable = (group1, group2) => {
    if (group1.height == group2.height && group1.minY == group2.minY) {
        if (group1.minX == group2.maxX || group1.maxX == group2.minX) {
            return true;
        }
    }
    if (group1.width == group2.width && group1.minX == group2.minX) {
        if (group1.minY == group2.maxY || group1.maxY == group2.minY) {
            return true;
        }
    }

    return false;
}

let redundantGroupsExist = (groups) => {
    for (let i = 0; i < groups.length; i++) {
        for (let j = 0; j < groups.length; j++) {
            if (i != j) {
                if (groupsAreRedundant(groups[i], groups[j])) {
                    return true;
                }
            }
        }
    }

    return false;
}

let groupsAreRedundant = (group1, group2) => {
    return (group1.minX >= group2.minX && group1.maxX <= group2.maxX
        && group1.minY >= group2.minY && group1.maxY <= group2.maxY);
}