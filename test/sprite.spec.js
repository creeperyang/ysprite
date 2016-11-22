const { basename } = require('path')
const test = require('ava')
const tempfile = require('tempfile')
const { generateStyle, generateSprite } = require('../lib/index')
const { read } = require('../lib/fs-promise')

function genConfig (retina, margin) {
    const imagePath = tempfile('.png')
    const retinaImagePath = imagePath.replace(/\.png$/, '@2x.png')
    const stylePath = tempfile('.css')
    const spriteOpts = {
        retina,
        dest: imagePath,
        retinaDest: retinaImagePath,
        margin
    }
    const styleOpts = {
        retina,
        imagePath,
        retinaImagePath,
        stylePath,
        banner: false
    }
    return { spriteOpts, styleOpts, imgDir: 'test/res/icons' }
}

function doTest (t, retina, margin = 0, name, aSpriteOpts = {}) {
    const { spriteOpts, styleOpts, imgDir } = genConfig(retina, margin)
    return generateSprite(imgDir, Object.assign(aSpriteOpts, spriteOpts)).then(data => {
        return generateStyle(data[0].source, styleOpts)
    }).then(data => {
        return Promise.all([
            read(`test/res/expected/sprite_${name}.png`),
            read(styleOpts.imagePath),
            read(`test/res/expected/sprite_${name}@2x.png`),
            read(styleOpts.retinaImagePath),
            read(`test/res/expected/style_${name}.css`),
            read(styleOpts.stylePath)
        ])
    }).then(files => {
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
        t.fail(err)
    })
}

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
    const { spriteOpts, styleOpts, imgDir } = genConfig(false, 0)
    return generateSprite(imgDir, Object.assign({
        compression: 'none',
        filter (filepath) {
            return !/@2x.png/.test(filepath)
        }
    }, spriteOpts)).then(data => {
        return Promise.all([
            read(`test/res/expected/sprite_compact.png`),
            read(styleOpts.imagePath)
        ])
    }).then(files => {
        t.is(files[0].length < files[1].length, true)
    }).catch(err => {
        t.fail(err)
    })
})

test('sprite without retina', t => {
    const { spriteOpts, styleOpts, imgDir } = genConfig(false, 0)
    return generateSprite(imgDir, Object.assign({
        filter (filepath) {
            return !/@2x.png/.test(filepath)
        }
    }, spriteOpts)).then(data => {
        return Promise.all([
            read(`test/res/expected/sprite_compact.png`),
            read(styleOpts.imagePath)
        ])
    }).then(files => {
        t.deepEqual(files[0], files[1])
    }).catch(err => {
        t.fail(err)
    })
})
