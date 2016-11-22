const fs = require('fs')
const test = require('ava')
const tempfile = require('tempfile')
const mergeImage = require('../src/lib/image')

test('mergeImage: should fail if sourceImgPaths or mergedImgPath invalid', t => {
    t.throws(mergeImage())
    t.throws(mergeImage([]))
    t.throws(mergeImage([], 'hi.png'))
})
test('mergeImage: should fail if sourceImgPaths has nonexistent path', t => {
    t.throws(mergeImage(['test/res/icons/app.png', 'nonexistent.png'], '.tmp/merge.png'))
})
test('mergeImage: should merge image successfully', t => {
    const temp = tempfile('.png')
    return mergeImage(['test/res/icons/app.png'], temp).then(info => {
        t.deepEqual(info.source, [{
            x: 0,
            y: 0,
            margin: 0,
            width: 35,
            height: 35,
            path: 'test/res/icons/app.png'
        }])
        t.is(info.merged.width, 35)
        t.is(info.merged.height, 35)
        t.is(info.merged.path, temp)
    })
})