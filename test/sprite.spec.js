const { basename } = require('path')
const { readFileSync } = require('fs')
const test = require('ava')
const tempfile = require('tempfile')
const generateStyle = require('../lib/style')
const generateSprite = require('../lib/sprite')
const { list } = require('../lib/fs-promise')

let IMAGES
function genConfig (retina, margin, filter) {
    const imagePath = tempfile('.png')
    const retinaImagePath = imagePath.replace(/\.png$/, '@2x.png')
    const stylePath = tempfile('.css')
    const spriteOpts = {
        retina,
        imagePath,
        retinaImagePath,
        filter: filter || '!**/*@2x.png',
        margin,
        writeToFile: true
    }
    const styleOpts = {
        retina,
        imagePath,
        retinaImagePath,
        stylePath,
        banner: false,
        writeToFile: true
    }
    return { spriteOpts, styleOpts, images: IMAGES }
}

function doTest (t, retina, margin = 0, name, aSpriteOpts = {}) {
    const { spriteOpts, styleOpts, images } = genConfig(retina, margin)
    return generateSprite(images, Object.assign(aSpriteOpts, spriteOpts)).then(data => {
        return generateStyle(data[0].source, styleOpts)
    }).then(data => {
        const files = [
            readFileSync(`test/res/expected/sprite_${name}.png`),
            readFileSync(styleOpts.imagePath),
            readFileSync(`test/res/expected/sprite_${name}@2x.png`),
            readFileSync(styleOpts.retinaImagePath),
            readFileSync(`test/res/expected/style_${name}.css`),
            readFileSync(styleOpts.stylePath)
        ]
        // check sprite image
        t.deepEqual(files[0], files[1])
        t.deepEqual(files[2], files[3])
        // check style
        const imageName = basename(styleOpts.imagePath, '.png')
        t.is(
            files[4].toString().replace(new RegExp('sprite_' + name, 'g'), imageName),
            files[5].toString()
        )
    }).catch(err => {
        t.fail(err && err.message)
    })
}

test.before(t => {
    return list('.', ['test/res/icons/**/*.png']).then(images => {
        IMAGES = images
    })
})

test('sprite of "compact" type with margin', t => {
    return doTest(t, true, 10, 'compact_margin')
})

test('sprite of "compact" type without margin', t => {
    return doTest(t, true, 0, 'compact')
})

test('sprite of "vertical" type', t => {
    return doTest(t, true, 0, 'vertical', {
        arrangement: 'vertical'
    })
})

test('sprite of "horizontal" type', t => {
    return doTest(t, true, 6, 'horizontal', {
        arrangement: 'horizontal'
    })
})

test('sprite with different compression level', t => {
    const { spriteOpts, styleOpts, images } = genConfig(false, 0)
    return generateSprite(images, Object.assign({
        compression: 'none',
        filter (filepath) {
            return !/@2x.png/.test(filepath)
        }
    }, spriteOpts)).then(data => {
        const files = [
            readFileSync(`test/res/expected/sprite_compact.png`),
            readFileSync(styleOpts.imagePath)
        ]
        t.is(files[0].length < files[1].length, true)
    }).catch(err => {
        t.fail(err && err.message)
    })
})

test('sprite without retina', t => {
    const { spriteOpts, styleOpts, images } = genConfig(false, 0)
    return generateSprite(images, Object.assign({
        filter (filepath) {
            return !/@2x.png/.test(filepath)
        }
    }, spriteOpts)).then(data => {
        const files = [
            readFileSync(`test/res/expected/sprite_compact.png`),
            readFileSync(styleOpts.imagePath)
        ]
        t.deepEqual(files[0], files[1])
    }).catch(err => {
        t.fail(err && err.message)
    })
})
