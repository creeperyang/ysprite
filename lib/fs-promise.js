const { readFile, writeFile, access } = require('fs')
const { parse, resolve } = require('path')
const glob = require('glob-all')
const mkdirp = require('mkdirp')
const resolvePath = resolve

/**
 * list files of specific dir
 * @param  {String} root    root dir
 * @param  {Array}  pattern glob pattern, such as ['abc/*.js']
 * @return {Object}         promise
 */
const list = (root, pattern = ['*.*']) => {
    return new Promise((resolve, reject) => {
        glob(pattern, root ? {
            cwd: root
        } : {}, (err, data) => {
            return err ? reject(err) : resolve(data)
        })
    })
}

/**
 * exist path or not
 * @param  {String} filename path
 * @return {Object}          promise
 */
const exist = filename => {
    return new Promise((resolve, reject) => {
        access(filename, err => err ? reject(err) : resolve())
    })
}

/**
 * write content to file
 * @param  {String}  filename             path
 * @param  {String}  content              content
 * @param  {Object}  options              options of writeFile
 * @param  {Boolean} createDirIfNotExists create dir if not exists
 * @return {Object}                      promise
 */
const write = (filename, content, options, createDirIfNotExists) => {
    return new Promise((resolve, reject) => {
        if (!filename) return reject('invalid file name')

        const dir = createDirIfNotExists && parse(filename).dir
        const promise = createDirIfNotExists ? exist(dir).catch(() => {
            return mkdir(dir)
        }) : Promise.resolve(null)
        promise.then(() => writeFile(
            filename,
            content,
            options,
            err => err ? reject(err) : resolve(filename)
        ))
    })
}

/**
 * create dir
 * @param  {String} dir dir
 * @return {Object}     promise
 */
const mkdir = dir => {
    return new Promise((resolve, reject) => {
        mkdirp(dir, err => err ? reject(err) : resolve())
    })
}

module.exports = { list, write, mkdir, exist }
