import { readFile, writeFile, access } from 'fs';
import { parse, resolve as resolvePath } from 'path';
import glob from 'glob-all';
import mkdirp from 'mkdirp';

/**
 * list files of specific dir
 * @param  {String} root    root dir
 * @param  {String} pattern glob pattern, such as 'abc/*.js'
 * @return {Object}         promise
 */
const list = (root, pattern = ['*.*']) => {
    return new Promise(function(resolve, reject) {
        glob(pattern, root ? {
            cwd: root
        } : {}, (err, data) =>  err ? reject(err) : resolve(root ?
            data.map((file) => resolvePath(root, file)) : data));
    });
};

/**
 * read file content
 * @param  {String} filename file path
 * @return {Object}          promise
 */
const read = (filename) => {
    return new Promise((resolve, reject) => {
        readFile(filename, {
            encoding: 'utf8'
        }, (err, result) => err ? reject(err) : resolve(result));
    });
};

/**
 * exist path or not
 * @param  {String} filename path
 * @return {Object}          promise
 */
const exist = (filename) => {
    return new Promise((resolve, reject) => {
        access(filename, err => err ? reject(err) : resolve());
    });
};

/**
 * write content to file
 * @param  {String} filename             path
 * @param  {String} content              content
 * @param  {Boolean} createDirIfNotExists create dir if not exists
 * @return {Object}                      promise
 */
const write = (filename, content, createDirIfNotExists) => {
    return new Promise((resolve, reject) => {
        let dir = createDirIfNotExists && filename && parse(filename).dir;
        let promise = createDirIfNotExists ? exist(dir).catch(() => {
            return mkdir(dir);
        }) : Promise.resolve(null);
        promise.then(() => {
            writeFile(filename, content, {
                encoding: 'utf8'
            }, (err) => err ? reject(err) : resolve());
        });
    });
};

/**
 * create dir
 * @param  {String} dir dir
 * @return {Object}     promise
 */
const mkdir = (dir) => {
    return new Promise((resolve, reject) => {
        mkdirp(dir, (err) => err ? reject(err) : resolve());
    });
};

export { list, read, write, mkdir, exist };
