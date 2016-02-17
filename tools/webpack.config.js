import { resolve } from 'path';
import webpack from 'webpack';

const loaders = [ {
    test: /\.js$/,
    include: [resolve(process.cwd(), 'src'), resolve(process.cwd(), 'bin')],
    loader: 'babel-loader'
}, {
    test: /\.json$/,
    include: [process.cwd()],
    loader: 'json'
}];

const cliConfig = {
    entry: ['babel-polyfill', process.cwd() + '/bin/cli.js'],
    output: {
        path: '.bin',
        filename: 'cli.js',
        libraryTarget: 'commonjs2',
        sourcePrefix: '    '
    },
    target: 'node',
    stats: {
        colors: true,
        timings: true
    },
    plugins: [new webpack.BannerPlugin('#!/usr/bin/env node', {
        raw: true,
        entryOnly: true
    })],
    externals: [/^[a-z\-0-9]+$/],
    module: { loaders }
};

const libConfig = {
    entry: ['babel-polyfill', process.cwd() + '/src/index.js'],
    output: {
        filename: 'index.js',
        libraryTarget: 'commonjs2',
        sourcePrefix: '    '
    },
    target: 'node',
    externals: [/^[a-z\-0-9]+$/],
    stats: {
        colors: true,
        timings: true
    },
    module: { loaders }
};

export { cliConfig, libConfig };
