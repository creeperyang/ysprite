import webpack from 'webpack';
import { libConfig } from './webpack.config';
import { format, task } from './util';

export default task(function compileLib() {
    return new Promise((resolve, reject) => {
        const bundler = webpack(libConfig);
        const run = (err, stats) => {
            if (err) {
                reject(err);
            } else {
                console.log(stats.toString(libConfig.stats));
                resolve();
            }
        };
        bundler.run(run);
    });
});
