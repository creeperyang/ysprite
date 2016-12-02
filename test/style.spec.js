const { readFileSync } = require('fs')
const test = require('ava')
const tempfile = require('tempfile')
const generateStyle = require('../lib/style')

test('generateStyle should fail if info list is invalid', t => {
    t.throws(generateStyle())
    t.throws(generateStyle([]))
})

test('generateStyle should generate style successfully with retina', t => {
    const eol = '\n'
    const expected = `.icon {${
        eol}    display: inline-block;${
        eol}    background-repeat: no-repeat;${
        eol}    background-image: url(SPRITE.png);${
        eol}    background-image: -webkit-image-set(url(SPRITE.png) 1x, url(SPRITE@2x.png) 2x);${
        eol}}${
        eol}.icon-icon {${
        eol}    background-position: 0px 0px;${
        eol}    width: 24px;${
        eol}    height: 36px;${
        eol}}`
    return generateStyle([{
        x: 0,
        y: 0,
        margin: 0,
        width: 24,
        height: 36,
        path: 'images/icon.png'
    }], {
        writeToFile: false,
        retina: true,
        banner: false,
        eol
    }).then(style => {
        t.is(style, expected)
    })
})

test('generateStyle should generate style successfully without retina', t => {
    const eol = '\n'
    const expected = `.icon {${
        eol}    display: inline-block;${
        eol}    background-repeat: no-repeat;${
        eol}    background-image: url(SPRITE.png);${
        eol}}${
        eol}.icon-icon {${
        eol}    background-position: 0px 0px;${
        eol}    width: 24px;${
        eol}    height: 36px;${
        eol}}`
    const banner = `/** ysprite **/${eol}`
    return generateStyle([{
        x: 0,
        y: 0,
        margin: 0,
        width: 24,
        height: 36,
        path: 'images/icon.png'
    }], {
        writeToFile: false,
        retina: false,
        banner,
        eol
    }).then(style => {
        t.is(style, banner + expected)
    })
})

test('generateStyle should generate style and write to file', t => {
    const eol = '\n'
    const expected = `.icon {${
        eol}    display: inline-block;${
        eol}    background-repeat: no-repeat;${
        eol}    background-image: url(SPRITE.png);${
        eol}}${
        eol}.icon-icon {${
        eol}    background-position: 0px 0px;${
        eol}    width: 24px;${
        eol}    height: 36px;${
        eol}}`
    const banner = `/** ysprite **/${eol}`
    const stylePath = tempfile('.css')
    return generateStyle([{
        x: 0,
        y: 0,
        margin: 0,
        width: 24,
        height: 36,
        path: 'images/icon.png'
    }], {
        writeToFile: true,
        retina: false,
        stylePath,
        banner,
        eol
    }).then(style => {
        t.is(style, banner + expected)
        t.is(style, readFileSync(stylePath, { encoding: 'utf8' }))
    })
})
