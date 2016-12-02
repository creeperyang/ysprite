#!/usr/bin/env node

const colors = require('colors') // eslint-disable-line
const minimatch = require('minimatch')
const program = require('./command')
const ysprite = require('../lib')
const pkg = require('../package.json')
const Spinner = require('./spinner')

const exitCli = (code = 0) => {
    process.exit(code)
}

program
    .version(pkg.version)
    .option('-s, --source <glob|dir>', 'required, source icons, like "img/icons/*.png", "img/icons"')
    .option('-o, --out-img <path>', 'required, sprite image path, like "img/sprite.png"')
    .option('--out-style <path>', 'set style path, like "css/icons.css"')
    .option('--out-retina <path>', 'set retina sprite image path. defaults to same with normal path and add "@2x" to filename')
    .option('--no-interlaced', 'disable png interlace')
    .option('--no-retina', 'disable generate retina image')
    .option('-c, --compression [level]', 'set png compression level. one of ["none", "fast", "high"], defaults to "high"',
        /none|fast|high/, 'high')
    .option('-m, --margin <number>', 'set margin between images. defaults to 0, prefer even number', parseInt)
    .option('--filter <glob>', 'set normal image filter.')
    .option('--retina-filter <glob>', 'set retina image filter.')
    .option('--arrangement [type]', 'set arrangement of images. one of ["compact", "vertical", "horizontal"], defaults to "compact"',
        /^(compact|vertical|horizontal)$/i, 'compact')
    .option('--no-style', 'disable generate style')
    .option('--style-prefix <prefix>', 'set style className prefix, defaults to "icon"')
    .option('--style-connector <connector>', 'set style className connector, defaults to "-"')
    .option('--style-suffix <suffix>', 'set style className suffix, defaults to ""')
    .option('--style-banner', 'enable style banner, defaults to false')

program.on('--help', () => {
    console.log('  Examples:'.green)
    console.log('')
    console.log('    $ ysprite -s img/icons -o img/sprite.png --out-retina img/sprite@2x.png --out-style css/sprite.css --compression high --margin 10'.grey)
    console.log(`    $ ysprite -s 'icons/**/*.png' -o tmp/sprite.png --no-retina --no-style`.grey)
    console.log('')
    console.log('')
    console.log(`  ★★★★★  created by ${pkg.author && pkg.author.name || 'yang'}  ★★★★★`.grey.bold)
})

program.parse(process.argv)

const {
    source, outImg, outRetina, outStyle,
    retina, interlaced, margin, arrangement, compression,
    filter, retinaFilter,
    style, styleBanner, stylePrefix, styleSuffix, styleConnector
} = program

if (program.rawArgs.length === 2) {
    console.log()
    console.log(`  ★★★★★  ysprite@v${pkg.version}  ★★★★★`.green)
    console.log()
    exitCli()
} else if (!verifyArgs()) {
    console.log()
    console.error('  error: options (source, out-img, out-style) are all reuiqred.'.red.bold)
    console.log()
    console.log('  run [ysprite --help] for more info.'.grey)
    console.log()
    exitCli(1)
}

function verifyArgs () {
    if (!source || !outImg) return false
    else if (!outStyle && style) return false

    return true
}

const spinner = new Spinner()

// set sprite options and style options
const spriteOpts = {
    imagePath: outImg,
    retinaImagePath: outRetina,
    retina,
    writeToFile: true,
    interlaced,
    margin: margin || 0,
    compression: compression || 'high',
    arrangement: arrangement || 'compact'
}

if (filter) {
    spriteOpts.filter = filename => minimatch(filename, filter)
}
if (retinaFilter) {
    spriteOpts.retinaFilter = filename => minimatch(filename, retinaFilter)
}

const styleOpts = style ? {
    imagePath: outImg,
    retinaImagePath: outRetina,
    retina,
    writeToFile: true,
    stylePath: outStyle,
    banner: styleBanner,
    prefix: stylePrefix,
    connector: styleConnector,
    suffix: styleSuffix
} : null

// start to sprite and style
spinner.start(' sprite...'.grey)
ysprite(source, {
    sprite: spriteOpts,
    style: styleOpts
}).then(res => {
    spinner.stop()
    console.log()
    console.log('  Sprite successfully!'.green.bold)
    const msg = [
        '  image: '.grey.bold,
        res.imagePath.grey,
        '  retina: '.grey.bold,
        (res.retinaImagePath || 'None').grey,
        '  style: '.grey.bold,
        (res.stylePath || 'None').grey
    ]
    console.log(`  ${msg.join('')}`)
}).catch(err => {
    spinner.stop()
    console.log()
    console.error('  Sorry, some error occurred.'.red.bold)
    console.log()
    console.error('  ' + err.toString().grey)
})
