import colors from 'colors';
import program from './command';
import { smartSprite, generateStyle } from '../src';

program
    .version('1.0.0')
    .option('-s, --source <path>', 'set source images dir, defaults to ./')
    .option('-o, --output <path>', 'set sprite image path, defaults to ./sprite.png')
    .option('-r, --retina', 'enable retina mode.')
    .option('--no-style', 'disable generate style')
    .option('--style-path <path>', 'style path. defaults to ./sprite.css')
    .parse(process.argv);

const defaults = {
    retina: true,
    style: true,
    stylePath: './sprite.css',
    source: './',
    output: './sprite.png'
};

const options = {};

for (let prop in defaults) {
    options[prop] = program[prop] == null ? defaults[prop] : program[prop];
}

const logOk = (msg) => console.log(colors.green(`[${new Date().toTimeString().slice(0, 8)}]`), msg);
const logErr = (msg) => console.log(colors.red(`[${new Date().toTimeString().slice(0, 8)}]`), msg);

logOk('start generate sprite');
smartSprite(options.source, options.output, options.retina).then((data) => {
    logOk(`finish. sprite path: ${options.output}`);
    
    if (!options.style) return;
    logOk('start generate style');
    return generateStyle(options.output, options.stylePath, data[0], true, {
        retina: options.retina
    });
}, (err) => {
    logErr('failed generate sprite');
}).then((data) => {
    data && logOk(`finish. style path: ${options.stylePath}`);
}, (err) => {
    logErr('failed generate style');
});
