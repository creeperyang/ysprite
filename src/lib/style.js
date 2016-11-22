const { basename, relative, dirname } = require('path')
const { write } = require('./fs-promise')

const IMG_PLACEHOLDER = 'SPRITE.png'
const RETINA_IMG_PLACEHOLDER = 'SPRITE@2x.png'

/**
 * generate style
 * @param  {Array}   infoList                The images (merged to sprite) info list, generated by `generateSprite`
 * @param  {Object}  options                 options
           {String}  options.connector       className connector, default to "-"
           {String}  options.prefix          className prefix, default to "icon"
           {String}  options.suffix          className suffix
           {Boolean} options.retina          generate retina style
           {Boolean} options.writeToFile     whether write style to file
           {String}  options.stylePath       style path
           {String}  options.imagePath       image path
           {String}  options.retinaImagePath retina image path
           {Boolean} options.banner          whether write banner to style
 * @return {String}                          generated style text
 */
function generateStyle(infoList, {
    connector = '-',
    prefix = 'icon',
    suffix = '',
    retina = true,
    writeToFile = true,
    stylePath,
    imagePath,
    retinaImagePath,
    banner = true
} = {}) {
    if (!infoList || !infoList.length) {
        return Promise.reject('invalid arguments')
    }
    const newLine = '\n';
    imagePath = !imagePath
        ? IMG_PLACEHOLDER
        : stylePath
        ? relative(dirname(stylePath), imagePath)
        : imagePath
    retinaImagePath = !retinaImagePath
        ? RETINA_IMG_PLACEHOLDER
        : stylePath
        ? relative(dirname(stylePath), retinaImagePath)
        : retinaImagePath
    let retinaBackgroundImage = retina ? `background-image: -webkit-image-set(url(${imagePath}) 1x, url(${retinaImagePath}) 2x);` : '';
    let bannerText = banner ? `/**${
        newLine}* Created at ${new Date().toLocaleString()}.${
        newLine}**/${
        newLine}` : ''
    let style = `${bannerText}.${prefix} {${
        newLine}    display: inline-block;${
        newLine}    background-repeat: no-repeat;${
        newLine}    background-image: url(${imagePath});${
        newLine}`
    style += retinaBackgroundImage ? `    ${retinaBackgroundImage}${
        newLine}}` : '}'
    infoList.forEach(({ x, y, width, height, margin, path }) => {
        let name = basename(path)
        let css = `.${prefix + connector + name.slice(0, name.lastIndexOf('.')) + (suffix ? connector + suffix : '')} {${
            newLine}    background-position: ${-x - margin / 2}px ${-y - margin / 2}px;${
            newLine}    width: ${width - margin}px;${
            newLine}    height: ${height - margin}px;${
        newLine}}`
        style += '\n' + css
    })

    return (writeToFile && stylePath)
        ? write(stylePath, style, true).then(() => style)
        : Promise.resolve(style)
}

module.exports = generateStyle
