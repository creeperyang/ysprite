#!/usr/bin/env node

const { relative, isAbsolute } = require('path')
const colors = require('colors')
const minimatch = require('minimatch')
const program = require('./command')
const { generateSprite, generateStyle } = require('../lib')
const pkg = require('../package.json')

const exitCli = (code = 0) => {
    process.exit(code)
}
const logOk = msg => console.log(colors.green(`[${new Date().toTimeString().slice(0, 8)}]`), msg)
const logErr = msg => console.log(colors.red(`[${new Date().toTimeString().slice(0, 8)}]`), msg)

program
    .version(pkg.version)
    .option('-s, --source <path>', 'required, set source images dir')
    .option('-o, --output <path>', 'required, set sprite image path')
    .option('--style-path <path>', 'set style path. ok to with .less/scss extension')
    .option('--output-retina <path>', 'set retina sprite image path. defaults to same with normal path and add "@2x" to filename')
    .option('--compression [level]', 'set png compression level. one of ["none", "fast", "high"], defaults to "high"',
        /none|fast|high/, 'high')
    .option('--margin <number>', 'set margin between images. defaults to 0, prefer even number', parseInt)
    .option('--filter <glob>', 'set normal image filter.')
    .option('--retina-filter <glob>', 'set retina image filter.')
    .option('--arrangement [arrange]', 'set arrangement of images. one of ["compact", "vertical", "horizontal"], defaults to "compact"',
        /^(compact|vertical|horizontal)$/i, 'compact')
    .option('--style-prefix <prefix>', 'set style className prefix, defaults to "icon"')
    .option('--style-connector <connector>', 'set style className connector, defaults to "-"')
    .option('--style-suffix <suffix>', 'set style className suffix, defaults to ""')
    .option('--style-banner', 'enable style banner, defaults to false')
    .option('--no-interlaced', 'disable png interlace')
    .option('-R, --no-retina', 'disable retina mode.')
    .option('--no-style', 'disable generate style')

program.on('--help', () => {
    console.log('  Examples:'.green)
    console.log('')
    console.log('    $ ysprite -s img/icons -o img/sprite.png --output-retina img/sprite@2x.png --style-path css/sprite.css --compression high --margin 10'.grey)
    console.log('    $ ysprite -s img/icons -o img/sprite.png --no-retina --no-style'.grey)
    console.log('    $ ysprite -s img/icons -o img/sprite.png --style-path sprite.less --style-prefix ico --style-connector __'.grey)
    console.log('')
    console.log('')
    console.log(`  ★★★★★  created by ${pkg.author && pkg.author.name || 'yang'}  ★★★★★`.grey.bold)
})

program.parse(process.argv)

const {
    retina, interlaced, margin, filter, retinaFilter,
    style, compression, output, outputRetina, source,
    stylePath, styleBanner, stylePrefix, styleSuffix,
    styleConnector, arrangement
} = program

if (program.rawArgs.length === 2) {
    console.log()
    console.log(`  ★★★★★  ysprite@v${pkg.version}  ★★★★★`.green)
    console.log()
    exitCli()
} else if (!source || !output || (!stylePath && style)) {
    console.log()
    console.log('  error: options (source, output, style-path) are all reuiqred.'.red)
    console.log()
    console.log('  run [ysprite --help] for more info.'.grey)
    console.log()
    exitCli(1)
}

// set sprite options and style options
const spriteOpts = {
    retina,
    interlaced,
    margin: typeof margin === 'number' ? margin : 0,
    compression: typeof compression === 'string' ? compression : 'high',
    dest: output,
    retinaDest: outputRetina,
    arrangement: typeof arrangement === 'string' ? arrangement : 'compact'
}

if (filter) {
    spriteOpts.filter = filename => minimatch(filename, filter)
}
if (retinaFilter) {
    spriteOpts.retinaFilter = filename => minimatch(filename, retinaFilter)
}

const styleOpts = {
    stylePath,
    imagePath: output,
    retinaImagePath: outputRetina,
    banner: !!styleBanner
}

// start to sprite and style
logOk('Start generate sprite.')
generateSprite(source, spriteOpts).then(data => {
    let retinaPath = ''
    if (data[1]) {
        retinaPath = outputRetina || (
            isAbsolute(output) ? data[1].merged.path : relative(process.cwd(), data[1].merged.path)
        )
        retinaPath = 'retina -> ' + retinaPath
    }
    logOk(`Finish.  Sprite path: normal -> ${output}  ${retinaPath}`)
    if (!style) return

    console.log('')
    logOk('Start generate style.')
    typeof stylePrefix === 'string' && (styleOpts.prefix = stylePrefix)
    typeof styleConnector === 'string' && (styleOpts.connector = styleConnector)
    typeof styleSuffix === 'string' && (styleOpts.suffix = styleSuffix)
    return generateStyle(data[0].source, styleOpts)
}, err => {
    logErr('Failed generate sprite:')
    console.error(err.stack ? err.stack : err)
}).then(data => {
    data && logOk(`Finish.  Style path: ${stylePath}`)
}, err => {
    logErr('Failed generate style:')
    console.error(err.stack ? err.stack : err)
})
