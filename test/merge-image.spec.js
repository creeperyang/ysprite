const test = require('ava')
const tempfile = require('tempfile')
const mergeImage = require('../lib/image')
const openImage = mergeImage.openImage

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
    const imgPath = 'test/res/icons/app.png'
    return mergeImage([imgPath], temp).then(info => {
        t.deepEqual(info.source, [{
            x: 0,
            y: 0,
            margin: 0,
            width: 35,
            height: 35,
            path: imgPath
        }])
        t.is(info.width, 35)
        t.is(info.height, 35)
        t.is(info.path, temp)
        return openImage(imgPath).then(img => {
            t.is(img.width(), 35)
            t.is(img.height(), 35)
            return new Promise((resolve, reject) => {
                img.toBuffer('png', (err, buf1) => {
                    t.ifError(err)
                    info.image.toBuffer('png', (err, buf2) => {
                        t.ifError(err)
                        t.deepEqual(buf1, buf2)
                        resolve()
                    })
                })
            })
        })
    })
})
