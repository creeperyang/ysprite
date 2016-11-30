const { dirname } = require('path')
const lwip = require('lwip')
const Packer = require('./packer')
const { mkdir, exist } = require('./fs-promise')

const transparent = [0, 0, 0, 0]

/**
 * Open image from file
 * @param  {String} filepath image path
 * @param  {Number} padding  padding of the image
 * @return {Object}          promise
 */
const openImage = (filepath, padding) => {
    padding = ~~padding
    return new Promise((resolve, reject) => {
        lwip.open(filepath, (err, image) => {
            if (err) return reject(err)
            if (padding) {
                image.pad(padding, padding, padding, padding, transparent, (err, image) => {
                    err ? reject(err) : (image.filepath = filepath, resolve(image))
                })
            } else {
                image.filepath = filepath
                resolve(image)
            }
        })
    })
}

/**
 * Create a new blank image
 * @param  {Number} width  width
 * @param  {Number} height height
 * @param  {Array|Object|String} color  bg color, default to transparent
 * @return {Object}        promise
 */
const createImage = (width, height, color = transparent) => {
    return new Promise((resolve, reject) => {
        lwip.create(width, height, color, (err, image) => {
            err ? reject(err) : resolve(image)
        })
    })
}

/**
 * Append source image to target image
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
            batch.setPixel(left + x, top + y, image.getPixel(x, y))
        }
    }
    return batch
}

/**
 * Write image to file
 * @param  {Object} image    image
 * @param  {String} filepath file path
 * @param  {String} format   image format: png|jpg|gif
 * @param  {Object} params   format-specific parameters
 * @return {Object}          promise
 */
const writeImage = (image, filepath, format, params) => {
    const dir = dirname(filepath)
    return new Promise((resolve, reject) => {
        exist(filepath).catch(err => mkdir(dir)).then(() => { // eslint-disable-line
            return image.writeFile(filepath, format, params, (err, image) => {
                err ? reject(err) : resolve(image)
            })
        }).catch(err => reject(err))
    })
}

/**
 * merge images
 * @param  {Array} sourceImgPaths  source image paths
 * @param  {String} mergedImgPath  dest image path
 * @param  {Object} options        setting:
 *                                     margin {Number} margin between icons
 *                                     arrangement {String} arrangement of images: 'vertical'|'horizontal'|'compact'
 *                                     compression {String} output png compression: 'none'|'fast'|'high'
 *                                     interlaced {Boolean} enable png interlaced
 * @return {Object}                promise
 */
function mergeImage (sourceImgPaths, mergedImgPath, options = {}) {
    if (!sourceImgPaths || !sourceImgPaths.length || typeof mergedImgPath !== 'string') {
        return Promise.reject('invalid sourceImgPaths or mergedImgPath')
    }
    sourceImgPaths = [].concat(sourceImgPaths).map(item => item + '')
    const margin = ~~options.margin
    let calcRects, calcPack, spriteImg, params
    return Promise.all(sourceImgPaths.map(filepath => openImage(filepath, margin / 2)))
        .then(images => {
            return images.map((image, index) => {
                const width = image.width()
                const height = image.height()
                return { width, height, image }
            })
        })
        .then(rects => {
            calcRects = rects
            switch (options.arrangement) {
                case 'vertical':
                    calcPack = Packer.verticalPack(rects)
                    break
                case 'horizontal':
                    calcPack = Packer.horizontalPack(rects)
                    break
                case 'compact':
                default:
                    calcPack = Packer.pack(rects)
            }
            return createImage(calcPack.width, calcPack.height)
        }).then(mergedImage => {
            spriteImg = mergedImage
            let batch = mergedImage.batch()
            calcRects.reduce((preBatch, { pack: { x, y }, width, height, image }) => {
                return appendImage(preBatch, image, x, y, width, height)
            }, batch)
            return [mergedImage, batch]
        }).then(([mergedImage, batch]) => {
            params = {
                compression: options.compression || 'high',
                interlaced: !!options.interlaced,
                transparency: true
            }
            return writeImage(batch, mergedImgPath, 'png', params)
        }).then(() => {
            return {
                source: calcRects.map(({ pack: { x, y }, width, height, image }) => {
                    return { x, y, margin, width, height, path: image.filepath }
                }),
                path: mergedImgPath,
                params: params,
                image: spriteImg,
                width: calcPack.width,
                height: calcPack.height
            }
        })
}

exports = module.exports = mergeImage
exports.openImage = openImage
exports.writeImage = writeImage
