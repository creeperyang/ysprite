import lwip from 'lwip';
import Packer from './packer';

const transparent = [0, 0, 0, 0];

const type = (operand) => {
    return Object.prototype.toString.call(operand).slice(8, -1).toLowerCase();
};

/**
 * open image
 * @param  {String} filepath image path
 * @return {Object}          promise
 */
const openImage = (filepath) => {
    return new Promise((resolve, reject) => {
        lwip.open(filepath, (err, image) => {
            err ? reject(err) : (image.filepath = filepath, resolve(image));
        });
    });
};

/**
 * create a new blank image
 * @param  {Number} width  width
 * @param  {Number} height height
 * @param  {Array|Object|String} color  bg color, default to transparent
 * @return {Object}        promise
 */
const createImage = (width, height, color = transparent) => {
    return new Promise((resolve, reject) => {
        lwip.create(width, height, color, (err, image) => {
            err ? reject(err) : resolve(image);
        });
    });
};

/**
 * append source image to target image
 * @param  {Object} batch  target image or target image's batch
 * @param  {Object} image  source image
 * @param  {Number} left   x coordinate
 * @param  {Number} top    y coordinate
 * @param  {Number} width  width
 * @param  {Number} height height
 * @return {Object}        target image
 */
const appendImage = (batch, image, left, top, width, height) => {
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            batch.setPixel(left + x, top + y, image.getPixel(x, y));
        }
    }
    return batch;
};

/**
 * save image to file
 * @param  {Object} image    image
 * @param  {String} filepath file path
 * @param  {String} format   image format: png|jpg|gif
 * @param  {Object} params   format-specific parameters
 * @return {Object}          promise
 */
const writeImage = (image, filepath, format, params) => {
    return new Promise((resolve, reject) => {
        image.writeFile(filepath, format, params, (err, image) => {
            err ? reject(err) : resolve(image);
        });
    });
};

/**
 * merge images
 * @param  {Array} sourceImgPaths source image paths
 * @param  {String} mergedImgPath  dest image path
 * @param  {String} arrange        how to merge images: 'vertical'|'horizental'|'smart'
 * @param  {number} margin         margin between images
 * @return {Object}                promise
 */
const mergeImage = async (sourceImgPaths, mergedImgPath, arrange = 'smart', margin = 0) => {
    if (!sourceImgPaths || !sourceImgPaths.length) {
        return Promise.reject('invalid sourceImgPaths');
    }
    if (type(sourceImgPaths) !== 'array') {
        sourceImgPaths = [sourceImgPaths + ''];
    }
    let images = await Promise.all(sourceImgPaths.map((filepath) =>
        openImage(filepath)));
    let rects = images.map((image, index) => {
        let width = image.width();
        let height = image.height();
        return { width, height, image };
    });
    let pack = new Packer().pack(Packer.sort(rects, 'maxSide'));
    let mergedImage = await createImage(pack.width, pack.height);
    let batch = mergedImage.batch();
    rects.reduce((preBatch, { pack: { x, y }, width, height, image}) => {
        return appendImage(preBatch, image, x, y, width, height);
    }, batch);
    await writeImage(batch, mergedImgPath, 'png', {
        compression: 'high',
        interlaced: true,
        transparency: true
    });
    return rects.map(({ pack: { x, y }, width, height, image}) => {
        return { x, y, width, height, path: image.filepath };
    });
};

export { mergeImage };
