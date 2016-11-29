const { join } = require('path')
const test = require('ava')
const tempfile = require('tempfile')
const { list, write, mkdir, exist } = require('../lib/fs-promise')

const rootDir = process.cwd() + '/test/res/icons'
const tmpDir = tempfile()

// list
test('fs-promise#list should list files if not set root dir', t => {
    list(null, ['package.json']).then(files => {
        t.is(files.length, 1)
    }).catch(err => test.fail(err))
})
test('fs-promise#list should list all files if set rootDir', t => {
    list(rootDir).then(files => {
        t.is(files.length, 26)
    }).catch(err => test.fail(err))
})
test('fs-promise#list should list no files if rootDir not exists', t => {
    list(rootDir + '/notexists').then(files => {
        t.is(files.length, 0)
    }).catch(err => test.fail(err))
})
test('fs-promise#list should list all files with complex pattern', t => {
    list(rootDir, ['app*.png', 'n*@2x.png']).then(files => {
        t.deepEqual(files, [
            'app.png',
            'app@2x.png',
            'next-double-disable@2x.png',
            'next-double@2x.png'
        ].map(v => join(rootDir, v)))
    }).catch(err => test.fail(err))
})

// write
test('fs-promise#write should fail to write file if dir not exists and set createDirIfNotExists to false', t => {
    t.throws(write(tmpDir + '/hi.txt', 'hi', null, false))
})
test('fs-promise#write should write file successfully if dir not exists but set createDirIfNotExists to true', t => {
    return write(tmpDir + '/hi.txt', 'hi', null, true).then(name => {
        t.is(name, tmpDir + '/hi.txt')
    })
})

// mkdir & exist
test('fs-promise#mkdir should create dir successfully', t => {
    t.notThrows(mkdir(tmpDir + '/deep').then(() => {
        return exist(tmpDir + '/deep')
    }))
})
test('fs-promise#exist should check dir existence successfully', t => {
    t.notThrows(exist(__dirname))
})
