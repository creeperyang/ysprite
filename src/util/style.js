import { basename, relative, dirname } from 'path';
import { write } from './fs-promise';

const genrateStyle = async (imagePath, stylePath, infoList, writeToFile = true, { connector = '-', prefix = 'icon', suffix = '' } = {}) => {
    let newLine = '\n';
    let relativePath = relative(dirname(stylePath), imagePath);
    let style = `/**${
        newLine}* Created at ${new Date().toLocaleString()}.${
        newLine}**/${
        newLine}.${prefix} {${
        newLine}    display: inline-block;${
        newLine}    background-repeat: no-repeat;${
        newLine}    background-image: url(${relativePath});${
        newLine}    background-image: -webkit-image-set(url(${relativePath}) 1x, url(${relativePath}) 2x);${
        newLine}}`;
    infoList.forEach(({x, y, width, height, path}) => {
        let name = basename(path);
        let css = `.${prefix + connector + name.slice(0, name.lastIndexOf('.')) + suffix} {${
            newLine}    background-position: -${x}px -${y}px;${
            newLine}    width: ${width}px;${
            newLine}    height: ${height}px;${
        newLine}}`;
        style += '\n' + css;
    });
    if (writeToFile) {
        await write(stylePath, style, true);
    }
    return style;
};

export default genrateStyle;
