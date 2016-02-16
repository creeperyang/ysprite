import colors from 'colors';
import program from './command';
import { generateSprite, generateStyle } from '../src';
import pkg from '../package.json';

/**
 * parse regexp from string
 * @param  {String} str regexp text, like "icons\\w*\.png,i" (/icons\w*.png/i)
 * @return {RegExp}     transformed regexp
 */
const parseRegexp = (str) => {
    const r = /([\s\S]+),([igm]{1,3})$/.exec(str);
    return r ? new RegExp(r[1], r[2]) : new RegExp(str);
};

const exitCli = (code = 0) => {
    process.exit(code);
};
const logOk = (msg) => console.log(colors.green(`[${new Date().toTimeString().slice(0, 8)}]`), msg);
const logErr = (msg) => console.log(colors.red(`[${new Date().toTimeString().slice(0, 8)}]`), msg);


program
    .version(pkg.version)
    .option('-s, --source [path]', 'required, set source images dir')
    .option('-o, --output [path]', 'required, set sprite image path')
    .option('--output-retina <path>', 'set retina sprite image path. defaults to same with normal path and add "@2x" to filename')
    .option('--style-path [path]', 'set style path. ok to with .less/scss extension')
    .option('--compression <level>', 'set png compression level. one of ["none", "fast", "high"], defaults to "high"',
        /none|fast|high/, 'high')
    .option('--margin [number]', 'set margin between images. defaults to 0, prefer even number', parseInt)
    .option('--filter [regexp]', 'set normal image filter.', parseRegexp)
    .option('--retina-filter [regexp]', 'set retina image filter.', parseRegexp)
    .option('--style-prefix [prefix]', 'set style className prefix, defaults to "icon"')
    .option('--style-connector [connector]', 'set style className connector, defaults to "-"')
    .option('--style-suffix [suffix]', 'set style className suffix, defaults to ""')
    .option('--style-banner', 'enable style banner, defaults to false')
    .option('--no-interlaced', 'disable png interlace')
    .option('-R, --no-retina', 'disable retina mode.')
    .option('--no-style', 'disable generate style');

program.on('--help', () => {
    console.log('  Examples:'.green);
    console.log('');
    console.log('    $ ysprite -s img/icons -o img/sprite.png --output-retina img/sprite@2x.png --style-path css/sprite.css --compression high --margin 10'.grey);
    console.log('    $ ysprite -s img/icons -o img/sprite.png --no-retina --no-style'.grey);
    console.log('    $ ysprite -s img/icons -o img/sprite.png --style-path sprite.less --style-prefix ico --style-connector __'.grey);
    console.log('');
    console.log('');
    console.log(`  Author: ${pkg.author}`.rainbow);
});

program.parse(process.argv);

const { retina, interlaced, margin, filter, retinaFilter, style, compression, output, outputRetina, source,
    stylePath, styleBanner, stylePrefix, styleSuffix, styleConnector } = program;

if (program.rawArgs.length === 2) {
    console.log('');
    console.log(`★★★★★  ysprite@v${pkg.version}  ★★★★★`.green);
    console.log('');
    exitCli();
} else if (!source || !output || (!stylePath && style)) {
    console.log('');
    console.log('Options of (source, output, style-path) are all reuiqred.'.red);
    console.log('');
    console.log('Run [ysprite --help] for more info.'.grey);
    console.log('');
    exitCli();
}


// set sprite options and style options
const spriteOpts = {
    retina,
    interlaced,
    margin: typeof margin === 'number' ? margin : 0,
    compression: typeof compression === 'string' ? compression : 'high',
    dest: output,
    retinaDest: outputRetina
};

if (filter) {
    spriteOpts.filter = (filename) => {
        return filter.test(filename);
    };
}
if (retinaFilter) {
    spriteOpts.retinaFilter = (filename) => {
        return retinaFilter.test(filename);
    };
}

const styleOpts = {
    stylePath,
    imagePath: output,
    retinaImagePath: outputRetina,
    banner: !!styleBanner
};

// start to sprite and style
logOk('Start generate sprite.');
generateSprite(source, spriteOpts).then((data) => {
    logOk(`Finish.    Sprite path: normal -> ${output}  retina -> ${outputRetina}`);
    if (!style) return;

    console.log('');
    logOk('Start generate style.');
    typeof stylePrefix === 'string' && (styleOpts.prefix = stylePrefix);
    typeof styleConnector === 'string' && (styleOpts.connector = styleConnector);
    typeof styleSuffix === 'string' && (styleOpts.suffix = styleSuffix);
    return generateStyle(data[0], styleOpts);
}, (err) => {
    logErr('Failed generate sprite:');
    console.error(err.stack ? err.stack : err);
}).then((data) => {
    data && logOk(`Finish.    Style path: ${stylePath}`);
}, (err) => {
    logErr('Failed generate style:');
    console.error(err.stack ? err.stack : err);
});
