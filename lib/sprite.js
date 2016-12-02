const minimatch = require('minimatch')
const mergeImage = require('./image')

/**
 * generate sprite
 * @param  {Array}        sourceList              source images list
 * @param  {Object}       options                 setting:
           {String}       options.imagePath       required, dest image path
           {String}       options.retinaImagePath dest retina image path
           {Boolean}      options.retina          whether to enable retina mode
           {Function}     options.filter          filter out normal image
           {Function}     options.retinaFilter    filter out retina image
           {Boolean}      options.writeToFile     whether write sprite image to file
           {Number}       options.margin          margin between icons
           {Boolean}      options.compression     output png compression, oneof ['none', 'fast', 'high']
           {Boolean}      options.interlaced      enable png interlaced
           {String}       options.arrangement     arrangement of images: 'vertical'|'horizontal'|'compact'
 * @return {Object}                               promise
 */
function generateSprite (sourceList, {
    imagePath,
    retinaImagePath,
    retina,
    filter,
    retinaFilter,
    writeToFile,
    margin = 0,
    compression = 'high',
    interlaced = false,
    arrangement = 'compact'
} = {}) {
    if (!sourceList || !sourceList.length) {
        return Promise.reject('invalid arguments')
    }

    if (retinaFilter && retina == null) {
        retina = true
    }

    let filterFn
    let retinaFilterFn
    // adjust filter
    if (filter instanceof RegExp) {
        filterFn = filename => filter.test(filename)
    } else if (typeof filter === 'string') {
        filterFn = filename => minimatch(filename, filter)
    } else if (typeof filter !== 'function'){
        filterFn = () => true
    }

    const promises = []
    let normalImages
    let retinaImages

    if (retina) {
        // get correct retinaFilter
        if (retinaFilter instanceof RegExp) {
            retinaFilterFn = filename => retinaFilter.test(filename)
        } else if (typeof retinaFilter === 'string') {
            retinaFilterFn = filename => minimatch(filename, retinaFilter)
        } else if (typeof retinaFilter !== 'function'){
            retinaFilterFn = filename => !filterFn(filename)
        }
        retinaImages = sourceList.filter(retinaFilterFn)
        promises.push(mergeImage(
            retinaImages,
            retinaImagePath || imagePath.replace(/(\.\w+)$/i, `@2x$1`),
            { writeToFile, compression, interlaced, arrangement, margin: margin * 2 }
        ))
    }
    normalImages = sourceList.filter(filterFn)
    promises.unshift(mergeImage(normalImages, imagePath, {
        writeToFile, compression, interlaced, arrangement, margin
    }))
    return Promise.all(promises)
}

module.exports = generateSprite
