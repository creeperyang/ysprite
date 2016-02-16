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
        } : {}, (err, data) =>  err ? reject(err) : resolve(data.map((file) => resolvePath(root, file))));
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
            }, (err, result) => err ? reject(err) : resolve(result));
        });
    });
};

/**
 * copy dir
 * @param  {String}   dir      source dir
 * @param  {String}   destDir  dest dir
 * @param  {Function} filter   filter source files
 * @param  {Function} modifier modify source file content
 * @return {Object}            promise
 */
async function copy(dir, destDir, filter = () => true, modifier = (content) => content) => {
    if (!dir || !destDir || dir === destDir) {
        return;
    }
    let sourceFiles = await list(undefined, [(dir + '/').replace(/\/\/$/, '/') + '**/*.*']);
    return await sourceFiles.filter(filter).map(async (filename) => {
        let destPath = resolve(destDir, parse(filename).base);
        return await write(destPath, await modifier(await read(filename)), true);
    });
};

/**
 * create dir
 * @param  {String} dir dir
 * @return {Object}     promise
 */
const mkdir = (dir) => {
    return new Promise((resolve, reject) => {
        mkdirp(dir, (err, result) => err ? reject(err) : resolve(result));
    });
};

export { list, read, write, mkdir, exist, copy };
