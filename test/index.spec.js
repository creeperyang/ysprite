const test = require('ava')
const tempfile = require('tempfile')
const ysprite = require('../lib')

test('main entry#ysprite should work correctly', t => {
    t.is(typeof ysprite.generateStyle, 'function')
    t.is(typeof ysprite.generateSprite, 'function')
    const imagePath = tempfile('.png')
    const retinaImagePath = imagePath.replace(/\.png$/, '@2x.png')
    const stylePath = tempfile('.css')
    return ysprite('test/res/icons', {
        sprite: {
            retina: true,
            imagePath,
            retinaImagePath,
            filter: '!**/*@2x.png',
            margin: 0,
            writeToFile: false
        },
        style: {
            retina: true,
            imagePath,
            retinaImagePath,
            stylePath,
            banner: false,
            writeToFile: false
        }
    }).then(res => {
        t.ok(res.image instanceof Buffer)
        t.ok(res.retina instanceof Buffer)
        t.is(typeof res.style, 'string')
    })
})
