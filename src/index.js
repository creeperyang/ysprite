const { list } = require('./lib/fs-promise')
const { mergeImage } = require('./lib/image')
const { getAbsolutePath, notInArray } = require('./lib/util')
const generateStyle = require('./lib/style')

/**
 * default filter to select retina image path
 * @param  {String} filepath file path
 * @return {Boolean}         if is retina image
 */
const retinaFilter = filepath => /@2x/.test(filepath)

/**
 * generate sprite
 * @param  {Array|String} sourceList             source images list, or source image dir
 * @param  {Object}       options                setting:
           {String}       options.dest           required, dest image path
           {String}       options.retinaDest     dest retina image path
           {Boolean}      options.retina         whether to enable retina mode
           {Function}     options.filter         filter out normal image
           {Function}     options.retinaFilter   filter out retina image
           {Number}       options.margin         margin between icons
           {Boolean}      options.compression    output png compression, oneof ['none', 'fast', 'high']
           {Boolean}      options.interlaced     enable png interlaced
           {String}       options.arrangement    arrangement of images: 'vertical'|'horizontal'|'compact'
 * @return {Object}                              promise
 */
function generateSprite (sourceList, options) {
    if (!sourceList || !sourceList.length || !options) {
        return Promise.reject('invalid arguments');
    }
    let retina = options.retina;
    if (options.retinaFilter && retina === undefined) {
        retina = true;
    }
    let promises = [], normalImages, retinaImages, promise
    if (typeof sourceList === 'string') {
        promise = list(getAbsolutePath(sourceList), options.glob || ['{*/*,*}.png'])
    } else {
        promise = Promise.resolve(sourceList)
    }
    return promise.then(sourceList => {
        if (retina) {
            retinaImages = sourceList.filter(options.retinaFilter || retinaFilter)
            promises.push(mergeImage(
                retinaImages,
                getAbsolutePath(options.retinaDest || options.dest.replace(/\.png$/i, '@2x.png')),
                Object.assign({}, options, { margin: options.margin * 2 })
            ))
            normalImages = sourceList.filter(
                options.filter ? options.filter : notInArray(retinaImages)
            )
        } else {
            normalImages = sourceList.filter(
                options.filter ? options.filter : () => true
            )
        }
        promises.unshift(mergeImage(normalImages, getAbsolutePath(options.dest), options))
        return Promise.all(promises)
    })
};

exports = module.exports = generateSprite
exports.generateStyle = generateStyle
exports.generateSprite = generateSprite
exports.mergeImage = mergeImage
