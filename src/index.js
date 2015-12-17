import { resolve, isAbsolute, dirname } from 'path';
import { list, read, write, mkdir, exist, copy } from './util/fs-promise';
import { mergeImage } from './util/image';
import generateStyle from './util/style';

const cwd = process.cwd();
const getAbsolutePath = (path) => isAbsolute(path) ? path : resolve(cwd, path);
const retinaFilter = (filepath) => /@2x/.test(filepath);
const antiRetinaFilter = (filepath) => !retinaFilter(filepath);
/**
 * sprite
 * @param  {Array} sourceList list of source image path
 * @param  {String} dest       sprite image path
 * @return {Object}            promise
 */
const sprite = async (sourceList, dest) => {
    return mergeImage([].concat(sourceList).map((path) => getAbsolutePath(path)), getAbsolutePath(dest));
};

/**
 * smart sprite
 * @param  {String}  source source images' dir
 * @param  {String}  dest   sprite image path
 * @param  {Boolean} retina enable retina mode
 * @return {Object}         promise
 */
const smartSprite = async (source, dest, retina = false) => {
    const validPaths = await list(getAbsolutePath(source), ['*.png']);
    let destPath = getAbsolutePath(dest);
    let promises = [sprite(retina ? validPaths.filter(antiRetinaFilter) : validPaths, destPath)];
    if (retina) {
        let retinaPaths = validPaths.filter(retinaFilter);
        retinaPaths.length && promises.push(sprite(retinaPaths, destPath.replace(/\.png$/i, '@2x.png')));
    }
    return Promise.all(promises);
};

export default sprite;
export { generateStyle, mergeImage, smartSprite };
