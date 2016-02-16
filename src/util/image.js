import { dirname } from 'path';
import lwip from 'lwip';
import Packer from './packer';
import { mkdir, exist } from './fs-promise';

const transparent = [0, 0, 0, 0];

const type = (operand) => {
    return Object.prototype.toString.call(operand).slice(8, -1).toLowerCase();
};

/**
 * open image from file
 * @param  {String} filepath image path
 * @param  {Number} padding  padding of the image
 * @return {Object}          promise
 */
const openImage = (filepath, padding) => {
    padding = ~~padding;
    return new Promise((resolve, reject) => {
        lwip.open(filepath, (err, image) => {
            if (err) return reject(err);
            if (padding) {
                image.pad(padding, padding, padding, padding, transparent, (err, image) => {
                    err ? reject(err) : (image.filepath = filepath, resolve(image));
                });
            } else {
                image.filepath = filepath;
                resolve(image);
            }
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
    const dir = dirname(filepath);
    const ensureDir = async (path) => {
        let isExist;
        try {
            isExist = await exist(path);
        } catch (e) {}
        if (!isExist) {
            await mkdir(path);
        }
    };
    return new Promise((resolve, reject) => {
        ensureDir(dir).then(() => {
            image.writeFile(filepath, format, params, (err, image) => {
                err ? reject(err) : resolve(image);
            });
        }).catch((err) => reject(err));
    });
};

/**
 * merge images
 * @param  {Array} sourceImgPaths  source image paths
 * @param  {String} mergedImgPath  dest image path
 * @param  {Object} options        setting:
 *                                     margin {Number} margin between icons
 *                                     arrangement {Number} arrangement of images: 'vertical'|'horizontal'|'compact'
 *                                     compression {String} output png compression: 'none'|'fast'|'high'
 *                                     interlaced {Boolean} enable png interlaced
 * @return {Object}                promise
 */
async function mergeImage(sourceImgPaths, mergedImgPath, options = {}) {
    if (!sourceImgPaths || !sourceImgPaths.length) {
        return Promise.reject('invalid sourceImgPaths');
    }
    if (type(sourceImgPaths) !== 'array') {
        sourceImgPaths = [sourceImgPaths + ''];
    }
    const margin = ~~options.margin;
    const arrangement = options.arrangement || 'compact';
    let images = await Promise.all(sourceImgPaths.map((filepath) => openImage(filepath, margin / 2)));
    let rects = images.map((image, index) => {
        let width = image.width();
        let height = image.height();
        return { width, height, image };
    });
    let pack;
    switch (arrangement) {
        case 'vertical':
            pack = Packer.verticalPack(rects);
            break;
        case 'horizontal':
            pack = Packer.horizontalPack(rects);
            break;
        case 'compact':
        default:
            pack = new Packer().pack(Packer.sort(rects, 'maxSide'));
    }
    let mergedImage = await createImage(pack.width, pack.height);
    let batch = mergedImage.batch();
    rects.reduce((preBatch, { pack: { x, y }, width, height, image }) => {
        return appendImage(preBatch, image, x, y, width, height);
    }, batch);
    await writeImage(batch, mergedImgPath, 'png', {
        compression: options.compression || 'high',
        interlaced: !!options.interlaced,
        transparency: true
    });
    return rects.map(({ pack: { x, y }, width, height, image }) => {
        return { x, y, margin, width, height, path: image.filepath };
    });
};

export default mergeImage;
export { mergeImage };
