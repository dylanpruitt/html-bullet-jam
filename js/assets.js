let assets = new Map();
let imagesLoaded = 0;
let totalImages = 0;

/**
 * This function loads all of the assets in the game into the assets Map.
 * @param {*} array 
 */
let loadAssets = () => {
    addAssetsFromConstructorArray(tileset);
    addAssetsFromConstructorArray(entityConstructors);
    addAssetsFromConstructorArray(bulletConstructors);
    addAssetsFromConstructorArray(weaponConstructors);
}

/**
 * This function iterates through a array of object constructors for functions
 *  (for example, tileset in tile.js or entityConstructors in entity.js) and loads
 *  images for all of the entries in said array.
 * @param {array} array array of object constructors
 */
let addAssetsFromConstructorArray = (array) => {
    totalImages += array.length;
    for (let i = 0; i < array.length; i++) {
        let object = array[i]();
        let image = new Image();
        image.addEventListener("load", function() {
            imagesLoaded++;
        }, false);
        image.src = object.imagePath;
        assets.set(object.imagePath, image);
    }
}