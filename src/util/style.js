import { basename, relative, dirname } from 'path';
import { write } from './fs-promise';

const IMG_PLACEHOLDER = 'SPRITE.png';
const RETINA_IMG_PLACEHOLDER = 'SPRITE@2x.png';

async function genrateStyle(infoList, { connector = '-', prefix = 'icon', suffix = '', retina = true, writeToFile = true, stylePath, imagePath, retinaImagePath, banner = true } = {}) {
    if (!infoList || !infoList.length) return;
    const newLine = '\n';
    imagePath = !imagePath ? IMG_PLACEHOLDER : stylePath ? relative(dirname(stylePath), imagePath) : imagePath;
    retinaImagePath = !retinaImagePath ? RETINA_IMG_PLACEHOLDER :
        stylePath ? relative(dirname(stylePath), retinaImagePath) : retinaImagePath;
    let retinaBackgroundImage = retina ? `background-image: -webkit-image-set(url(${imagePath}) 1x, url(${retinaImagePath}) 2x);` : '';
    let bannerText = banner ? `/**${
        newLine}* Created at ${new Date().toLocaleString()}.${
        newLine}**/${
        newLine}` : '';
    let style = `${bannerText}.${prefix} {${
        newLine}    display: inline-block;${
        newLine}    background-repeat: no-repeat;${
        newLine}    background-image: url(${imagePath});${
        newLine}`;
    style += retinaBackgroundImage ? `    ${retinaBackgroundImage}${
        newLine}}` : '}';
    infoList.forEach(({ x, y, width, height, margin, path }) => {
        let name = basename(path);
        let css = `.${prefix + connector + name.slice(0, name.lastIndexOf('.')) + (suffix ? connector + suffix : '')} {${
            newLine}    background-position: ${-x - margin / 2}px ${-y - margin / 2}px;${
            newLine}    width: ${width - margin}px;${
            newLine}    height: ${height - margin}px;${
        newLine}}`;
        style += '\n' + css;
    });
    if (writeToFile && stylePath) {
        await write(stylePath, style, true);
    }
    return style;
};

export default genrateStyle;
