const { statSync } = require('fs')
const { resolve, join } = require('path')
const { list } = require('./fs-promise')
const generateStyle = require('./style')
const generateSprite = require('./sprite')

exports = module.exports = ysprite
exports.generateSprite = generateSprite
exports.generateStyle = generateStyle

function ysprite (imgGlob, { sprite, style }) {
    let isDir
    let filesPromise
    try {
        // imgGlob could be normal dir or glob
        isDir = statSync(imgGlob).isDirectory()
    } catch (e) {}
    if (isDir) {
        filesPromise = list(resolve(imgGlob), ['**/*.png']).then(files => {
            return files.map(f => join(imgGlob, f))
        })
    } else {
        filesPromise = list(process.cwd(), [].concat(imgGlob))
    }
    return filesPromise.then(files => {
        if (!sprite) throw new Error('sprite: miss sprite options')
        return generateSprite(files, sprite)
    }).then(data => {
        return Promise.all([
            data,
            style ? generateStyle(data[0].source, style) : null
        ])
    }).then(([spriteData, styleData]) => {
        const normal = spriteData[0]
        const retina = spriteData[1]
        return Promise.all([getBuffer(normal), retina && getBuffer(retina)])
            .then(([image, retinaImg]) => {
                return {
                    image,
                    retina: retinaImg,
                    imagePath: normal.path,
                    retinaImagePath: retina && retina.path,
                    style: styleData,
                    stylePath: style && style.stylePath
                }
            })
    })
}

function getBuffer (res) {
    return new Promise((resolve, reject) => {
        res.image.toBuffer('png', res.params, (err, buf) => {
            err ? reject(err) : resolve(buf)
        })
    })
}
