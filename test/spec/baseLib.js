import { exec } from 'child_process';
import fs from 'fs';
import Packer from '../../src/lib/packer';
import { list, read, write, mkdir, exist, copy } from '../../src/lib/fs-promise';

describe('Base lib', () => {
    describe('Packer', () => {
        describe('class method # sort', () => {
            const rects = [{
                width: 30,
                height: 60
            }, {
                width: 40,
                height: 50
            }, {
                width: 100,
                height: 50
            }, {
                width: 120,
                height: 120
            }];
            it('should sort rects with maxSide', () => {
                const sorted = Packer.sort(rects, 'maxSide');
                expect(sorted).toEqual([{
                    width: 120,
                    height: 120
                }, {
                    width: 100,
                    height: 50
                }, {
                    width: 30,
                    height: 60
                }, {
                    width: 40,
                    height: 50
                }]);
            });
            it('should sort rects with area', () => {
                const sorted = Packer.sort(rects, 'area');
                expect(sorted).toEqual([{
                    width: 120,
                    height: 120
                }, {
                    width: 100,
                    height: 50
                }, {
                    width: 40,
                    height: 50
                }, {
                    width: 30,
                    height: 60
                }]);
            });
            it('should sort rects with width', () => {
                const sorted = Packer.sort(rects, 'width');
                expect(sorted).toEqual([{
                    width: 120,
                    height: 120
                }, {
                    width: 100,
                    height: 50
                }, {
                    width: 40,
                    height: 50
                }, {
                    width: 30,
                    height: 60
                }]);
            });
            it('should sort rects with height', () => {
                const sorted = Packer.sort(rects, 'height');
                expect(sorted).toEqual([{
                    width: 120,
                    height: 120
                }, {
                    width: 30,
                    height: 60
                }, {
                    width: 100,
                    height: 50
                }, {
                    width: 40,
                    height: 50
                }]);
            });
            it('should not sort rects if not set sort type', () => {
                const sorted = Packer.sort(rects);
                expect(sorted).toBe(rects);
            });
        });

        describe('class method # verticalPack/horizontalPack', () => {
            const rects = [{
                width: 30,
                height: 60
            }, {
                width: 40,
                height: 50
            }, {
                width: 100,
                height: 50
            }, {
                width: 120,
                height: 120
            }];
            it('should correctly pack rects (vertical)', () => {
                const pack = Packer.verticalPack(rects);
                expect(pack).toEqual({
                    width: 120,
                    height: 280
                });
                expect(rects).toEqual([{
                    width: 120,
                    height: 120,
                    pack: {
                        x: 0,
                        y: 0
                    }
                }, {
                    width: 100,
                    height: 50,
                    pack: {
                        x: 0,
                        y: 120
                    }
                }, {
                    width: 40,
                    height: 50,
                    pack: {
                        x: 0,
                        y: 170
                    }
                }, {
                    width: 30,
                    height: 60,
                    pack: {
                        x: 0,
                        y: 220
                    }
                }]);
            });
            it('should not pack rects (vertical) if there is no valid rects', () => {
                const pack = Packer.verticalPack('');
                expect(pack).toBe(false);
            });

            it('should correctly pack rects (horizontal)', () => {
                const pack = Packer.horizontalPack(rects);
                expect(pack).toEqual({
                    width: 290,
                    height: 120
                });
                expect(rects).toEqual([{
                    width: 120,
                    height: 120,
                    pack: {
                        x: 0,
                        y: 0
                    }
                }, {
                    width: 30,
                    height: 60,
                    pack: {
                        x: 120,
                        y: 0
                    }
                }, {
                    width: 100,
                    height: 50,
                    pack: {
                        x: 150,
                        y: 0
                    }
                }, {
                    width: 40,
                    height: 50,
                    pack: {
                        x: 250,
                        y: 0
                    }
                }]);
            });
            it('should not pack rects (horizontal) if there is no valid rects', () => {
                const pack = Packer.horizontalPack('');
                expect(pack).toBe(false);
            });
        });

        describe('instance method # pack', () => {
            it('should correctly pack rects', () => {
                const sorted = [{
                    width: 120,
                    height: 120
                }, {
                    width: 100,
                    height: 50
                }, {
                    width: 30,
                    height: 60
                }, {
                    width: 40,
                    height: 50
                }];
                const { right, down, ...root } = new Packer().pack(sorted);
                sorted.forEach(({ pack }) => {
                    delete pack.right;
                    delete pack.down;
                    delete pack.used;
                });
                expect(root).toEqual({
                    x: 0,
                    y: 0,
                    used: true,
                    width: 220,
                    height: 120
                });
                expect(sorted).toEqual([{
                    width: 120,
                    height: 120,
                    pack: {
                        x: 0,
                        y: 0,
                        width: 120,
                        height: 120
                    }
                }, {
                    width: 100,
                    height: 50,
                    pack: {
                        x: 120,
                        y: 0,
                        width: 100,
                        height: 120
                    }
                }, {
                    width: 30,
                    height: 60,
                    pack: {
                        x: 120,
                        y: 50,
                        width: 100,
                        height: 70
                    }
                }, {
                    width: 40,
                    height: 50,
                    pack: {
                        x: 150,
                        y: 50,
                        width: 70,
                        height: 60
                    }
                }]);
            });
            it('should not pack rects if there is no valid rects', () => {
                const pack = new Packer().pack();
                expect(pack).toBe(false);
            });
        });
    });

    describe('fs-promise', () => {
        const rootDir = process.cwd() + '/src';
        const tmpDir = process.cwd() + '/.tmp';

        describe('list', () => {
            it('should list all files at pwd if not set rootDir', (done) => {
                list().then((files) => {
                    expect(files.length).toEqual(3);
                    done();
                }).catch((err) => done.fail(err));
            });
            it('should list all files successfully if set rootDir', (done) => {
                list(rootDir).then((files) => {
                    expect(files.length).toEqual(1);
                    expect(files[0]).toEqual(rootDir + '/index.js');
                    done();
                }).catch((err) => done.fail(err));
            });
            it('should list no files if rootDir not exists', (done) => {
                list(rootDir + '/utils').then((files) => {
                    expect(files.length).toEqual(0);
                    done();
                }).catch((err) => done.fail(err));
            });
            it('should list all files with complex pattern', (done) => {
                list(rootDir, ['*.js', 'lib/*', '!lib/fs-promise.js']).then((files) => {
                    expect(files.length).toEqual(5);
                    expect(files).toEqual(jasmine.arrayContaining([
                        rootDir + '/index.js',
                        rootDir + '/lib/image.js',
                        rootDir + '/lib/packer.js',
                        rootDir + '/lib/style.js']));
                    done();
                }).catch((err) => done.fail(err));
            });
            it('should report error', (done) => {
                const original = fs.readdir;
                const error = new Error('mock fs.readdir error');
                fs.readdir = (path, cb) => {
                    process.nextTick(() => {
                        cb(error);
                    });
                };
                list(rootDir).then(() => {
                    fs.readdir = original;
                    done.fail('should not invoke');
                }).catch((err) => {
                    fs.readdir = original;
                    expect(err).toBe(error);
                    done();
                });
            });
        });

        describe('write', () => {
            beforeAll((done) => {
                exec('rm -rf .tmp', (err) => {
                    err ? done.fail(err) : done();
                });
            });
            afterAll((done) => {
                exec('rm -rf .tmp', (err) => {
                    err ? done.fail(err) : done();
                });
            });
            it('should fail to write file if dir not exists and set createDirIfNotExists to false', (done) => {
                write(tmpDir + '/hi.txt', 'hi', false).then(() => {
                    done.fail('should not write file');
                }).catch((err) => {
                    expect(err).toBeTruthy();
                    done();
                });
            });
            it('should write file successfully if dir not exists and set createDirIfNotExists to true', (done) => {
                write(tmpDir + '/hi.txt', 'hi', true).then((content) => {
                    expect(content).toBeUndefined();
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });
        });

        describe('read', () => {
            const content = 'hi';
            const filepath = tmpDir + '/hi.txt';
            beforeAll((done) => {
                write(filepath, content, true).then((content) => {
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });
            afterAll((done) => {
                exec('rm -rf .tmp', (err) => {
                    err ? done.fail(err) : done();
                });
            });
            it('should fail to read file if file not exists', (done) => {
                read(filepath + '.md').then(() => {
                    done.fail('should not read unexists file');
                }).catch((err) => {
                    expect(err).not.toBeNull();
                    done();
                });
            });
            it('should read file successfully', (done) => {
                read(filepath).then((content) => {
                    expect(content).toEqual(content);
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });
        });

        describe('mkdir', () => {
            beforeAll((done) => {
                exec('rm -rf .tmp', (err) => {
                    err ? done.fail(err) : done();
                });
            });
            afterAll((done) => {
                exec('rm -rf .tmp', (err) => {
                    err ? done.fail(err) : done();
                });
            });
            it('should create dir successfully', (done) => {
                mkdir(tmpDir + '/deep').then(() => {
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });
            it('should fail to create dir if permission denied', (done) => {
                mkdir('/etc/.tmp').then(() => {
                    done.fail('should not invoke');
                }).catch((err) => {
                    expect(err).toBeTruthy();
                    done();
                });
            });
        });
    });
});
