import webpack from 'webpack';
import { cliConfig } from './webpack.config';
import { format, task } from './util';

export default task(function compileCli() {
    return new Promise((resolve, reject) => {
        const bundler = webpack(cliConfig);
        const run = (err, stats) => {
            if (err) {
                reject(err);
            } else {
                console.log(stats.toString(cliConfig.stats));
                resolve();
            }
        };
        bundler.run(run);
    });
});
