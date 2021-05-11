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

let boundTest4 = [
    0, 0, 0, 0, 0,
    0, 0, 0, 1, 0,
    0, 1, 1, 1, 0,
    0, 1, 1, 1, 0,
    0, 0, 0, 0, 0,
]; // 2 groups

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
    console.log(boundGroups);

    // cols
    for (let i = 0; i < TEST_WIDTH; i++) {
        for (let j = 0; j < TEST_WIDTH; j++) {
            let index = j * TEST_WIDTH + i;
            if (collisionArray[index] == 1) {
                currentBounds.push(index);
                if (j == TEST_WIDTH - 1 || collisionArray[index + TEST_WIDTH] == 0) {
                    boundGroups.push(currentBounds);
                    currentBounds = [];
                }
            }
        }
    }
    console.log(boundGroups);

    // cleaning and merging
    while (groupsCanBeMerged(boundGroups)) {
        let temp = [];
        for (let i = 0; i < boundGroups.length; i++) {
            let alreadyModified = false;
            for (let j = 0; j < boundGroups.length; j++) {
                if (i != j) {
                    if (groupsAreMergeable(boundGroups[i], boundGroups[j])) {
                        if (alreadyModified) {
                            temp[temp.length - 1].push.apply(temp[temp.length - 1], boundGroups[j]);
                        } else {
                            let newGroup = boundGroups[i];
                            newGroup.push.apply(newGroup, boundGroups[j]);
                            temp.push(newGroup);
                            alreadyModified = true;
                        }
                    }
                }
            }
        }
        boundGroups = temp;
        console.log(boundGroups);
    }

    

    for (let i = 0; i < boundGroups.length; i++) {
        boundGroups[i] = getUniqueIndices(boundGroups[i]);
    }

    while (redundantGroupsExist(boundGroups)) {
        for (let i = 0; i < boundGroups.length; i++) {
            for (let j = 0; j < boundGroups.length; j++) {
                if (i != j) {
                    if (groupsAreRedundant(boundGroups[i], boundGroups[j])) {
                        boundGroups[i] = [];
                        j = boundGroups.length;
                    }
                }
            }
        }

        let temp = [];
        for (let i = 0; i < boundGroups.length; i++) {
            if (boundGroups[i].length > 0) { temp.push(boundGroups[i]); }
        }

        boundGroups = temp;
        console.log("GROUPS:");
        console.log(boundGroups);
    }

    let t1 = performance.now();
    console.log("Took " + (t1 - t0) + "ms");
    return boundGroups;
}

let getUniqueIndices = (group) => {
    let temp = [];
    for (let i = 0; i < group.length; i++) {
        if (!temp.includes(group[i])) {
            temp.push(group[i]);
        }
    }
    return temp;
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
    if (group1.length % TEST_WIDTH == group2.length % TEST_WIDTH) {
        if (Math.abs(group2[group2.length - 1] - group1[group1.length - 1]) == 1 
            || Math.abs(group2[group2.length - 1] - group1[group1.length - 1]) == 5) {
            if (group1.length > 1 && group2.length > 1) {
                if (Math.abs(group2[group2.length - 1] - group1[group1.length - 1]) == 
                    Math.abs(group2[group2.length - 2] - group1[group1.length - 2])) {
                        return true;
                    }
            } else {
                return true;
            }
        }
    }

    return false;
}

let groupsAreRedundant = (group1, group2) => {
    for (let i = 0; i < group1.length; i++) {
        if (!group2.includes(group1[i])) {
            return false;
        }
    }

    return true;
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