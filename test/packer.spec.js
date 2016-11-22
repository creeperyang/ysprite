const test = require('ava')
const Packer = require('../lib/packer')

const rects = [{
    width: 30,
    height: 60
}, {
    width: 40,
    height: 50
}, {
    width: 100,
    height: 50
}, {
    width: 120,
    height: 120
}]

// sort
test('Packer#sort should sort rects with max side', t => {
    const sorted = Packer.sort(rects, 'maxSide')
    t.deepEqual(sorted, [{
        width: 120,
        height: 120
    }, {
        width: 100,
        height: 50
    }, {
        width: 30,
        height: 60
    }, {
        width: 40,
        height: 50
    }])
})
test('Packer#sort should sort rects with area', t => {
    const sorted = Packer.sort(rects, 'area')
    t.deepEqual(sorted, [{
        width: 120,
        height: 120
    }, {
        width: 100,
        height: 50
    }, {
        width: 40,
        height: 50
    }, {
        width: 30,
        height: 60
    }])
})
test('Packer#sort should sort rects with width', t => {
    const sorted = Packer.sort(rects, 'width')
    t.deepEqual(sorted, [{
        width: 120,
        height: 120
    }, {
        width: 100,
        height: 50
    }, {
        width: 40,
        height: 50
    }, {
        width: 30,
        height: 60
    }])
})
test('Packer#sort should sort rects with height', t => {
    const sorted = Packer.sort(rects, 'height')
    t.deepEqual(sorted, [{
        width: 120,
        height: 120
    }, {
        width: 30,
        height: 60
    }, {
        width: 100,
        height: 50
    }, {
        width: 40,
        height: 50
    }])
})
test('Packer#sort should not sort rects if not set sort type', t => {
    const sorted = Packer.sort(rects)
    t.is(sorted, rects)
})

// verticalPack/horizontalPack
test('Packer#verticalPack should correctly pack rects vertically', t => {
    const pack = Packer.verticalPack(rects)
    t.deepEqual(pack, {
        width: 120,
        height: 280
    })
    t.deepEqual(rects, [
        {
            width: 120,
            height: 120,
            pack: {
                x: 0,
                y: 0
            }
        }, {
            width: 100,
            height: 50,
            pack: {
                x: 0,
                y: 120
            }
        }, {
            width: 40,
            height: 50,
            pack: {
                x: 0,
                y: 170
            }
        }, {
            width: 30,
            height: 60,
            pack: {
                x: 0,
                y: 220
            }
        }
    ])
})
test('Packer#verticalPack should correctly handle invalid rects', t => {
    const pack = Packer.verticalPack()
    t.is(pack, false)
})
test('Packer#horizontalPack should correctly pack rects horizontally', t => {
    const pack = Packer.horizontalPack(rects)
    t.deepEqual(pack, {
        width: 290,
        height: 120
    })
    t.deepEqual(rects, [
        {
            width: 120,
            height: 120,
            pack: {
                x: 0,
                y: 0
            }
        }, {
            width: 30,
            height: 60,
            pack: {
                x: 120,
                y: 0
            }
        }, {
            width: 100,
            height: 50,
            pack: {
                x: 150,
                y: 0
            }
        }, {
            width: 40,
            height: 50,
            pack: {
                x: 250,
                y: 0
            }
        }
    ])
})
test('Packer#horizontalPack should correctly handle invalid rects', t => {
    const pack = Packer.horizontalPack()
    t.is(pack, false)
})

// pack
test('Packer#pack should correctly pack rects compactly', t => {
    const sorted = [{
        width: 120,
        height: 120
    }, {
        width: 100,
        height: 50
    }, {
        width: 30,
        height: 60
    }, {
        width: 40,
        height: 50
    }]
    const root = new Packer().pack(sorted)
    delete root.right
    delete root.down
    sorted.forEach(({ pack }) => {
        delete pack.right
        delete pack.down
        delete pack.used
    })
    t.deepEqual(root, {
        x: 0,
        y: 0,
        used: true,
        width: 220,
        height: 120
    })
    t.deepEqual(sorted, [
        {
            width: 120,
            height: 120,
            pack: {
                x: 0,
                y: 0,
                width: 120,
                height: 120
            }
        }, {
            width: 100,
            height: 50,
            pack: {
                x: 120,
                y: 0,
                width: 100,
                height: 120
            }
        }, {
            width: 30,
            height: 60,
            pack: {
                x: 120,
                y: 50,
                width: 100,
                height: 70
            }
        }, {
            width: 40,
            height: 50,
            pack: {
                x: 150,
                y: 50,
                width: 70,
                height: 60
            }
        }
    ])
})
test('Packer#pack should correctly handle invalid rects', t => {
    const pack = new Packer().pack()
    t.is(pack, false)
})
