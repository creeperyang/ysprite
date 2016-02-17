import { resolve, isAbsolute } from 'path';

const cwd = process.cwd();

/**
 * get absoulute path from path
 * @param  {String} path source path
 * @return {String}      absolute path
 */
const getAbsolutePath = (path) => isAbsolute(path) ? path : resolve(cwd, path);

/**
 * check if an item is in an array
 * @param  {Array}  arr target array
 * @return {Function}   function to check item
 */
const notInArray = (arr = []) => {
    return (item) => arr.indexOf(item) === -1;
};

export { getAbsolutePath, notInArray };
