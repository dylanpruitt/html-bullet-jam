let boundTest1 = [
    0, 0, 0, 0, 0,
    0, 1, 0, 1, 0,
    0, 0, 0, 0, 0,
    0, 1, 0, 1, 0,
    0, 0, 0, 0, 0,
]; // 4 groups

let boundTest2 = [
    0, 0, 0, 0, 0,
    0, 0, 0, 1, 0,
    0, 1, 1, 1, 0,
    0, 1, 0, 1, 0,
    0, 0, 0, 1, 0,
]; // 3 groups

let boundTest3 = [
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
    1, 1, 1, 1, 1,
]; // 1 group

let TEST_WIDTH = 5;

let generateBoundGroups = (collisionArray) => {
    let t0 = performance.now();
    let boundGroups = [];
    let currentBounds = [];
    // rows
    for (let i = 0; i < TEST_WIDTH; i++) {
        for (let j = 0; j < TEST_WIDTH; j++) {
            let index = i * TEST_WIDTH + j;
            if (collisionArray[index] == 1) {
                currentBounds.push(index);
                if (j == TEST_WIDTH - 1 || collisionArray[index + 1] == 0) {
                    boundGroups.push(currentBounds);
                    currentBounds = [];
                }
            }
        }
    }
    // cols
    for (let i = 0; i < TEST_WIDTH; i++) {
        for (let j = 0; j < TEST_WIDTH; j++) {
            let index = j * TEST_WIDTH + i;
            if (collisionArray[index] == 1) {
                currentBounds.push(index);
                if (j == TEST_WIDTH - 1 || collisionArray[index + 1] == 0) {
                    boundGroups.push(currentBounds);
                    currentBounds = [];
                }
            }
        }
    }
    let t1 = performance.now();
    console.log("Took " + (t1 - t0) + "ms");
    return boundGroups;
}