import { generateStyle, generateSprite } from '../../src/index.js';
import { read } from '../../src/util/fs-promise';

describe('Main Function (generate sprite and style)', () => {
    const retina = true;
    const imgDir = './test/res/icons';

    let methods = {
        reportError() {},
        reportOk(which) {}
    };

    describe('sprite of "compact" type', () => {
        describe('with margin', () => {
            const stylePath = './test/res/style_compact_margin.css';
            const imagePath = './test/res/sprite_compact_margin.png';
            const retinaImagePath = './test/res/sprite_compact_margin@2x.png';
            const spriteOpts = {
                retina,
                dest: imagePath,
                retinaDest: retinaImagePath
            };
            const styleOpts = {
                retina,
                imagePath,
                retinaImagePath,
                source: imgDir,
                banner: false
            };
            beforeAll((done) => {
                spyOn(methods, 'reportError').and.callThrough();
                spyOn(methods, 'reportOk').and.callThrough();
                generateSprite(imgDir, { ...spriteOpts, margin: 10 }).then((data) => {
                    methods.reportOk('sprite');
                    return generateStyle(data[0], { ...styleOpts, stylePath });
                }, (err) => {
                    methods.reportError();
                    done.fail(err);
                }).then((data) => {
                    methods.reportOk('style');
                    done();
                }, (err) => {
                    methods.reportError();
                    done.fail(err);
                });
            });
        
            it('should generate sprite successfully.', (done) => {
                expect(methods.reportError).not.toHaveBeenCalled();
                expect(methods.reportOk).toHaveBeenCalledWith('sprite');
                Promise.all([read('test/res/expected/sprite_compact_margin.png'), read('test/res/expected/sprite_compact_margin@2x.png'), read(imagePath), read(retinaImagePath)]).then((files) => {
                    expect(files[0]).toEqual(files[2]);
                    expect(files[1]).toEqual(files[3]);
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });

            it('should generate style successfully.', (done) => {
                expect(methods.reportError).not.toHaveBeenCalled();
                expect(methods.reportOk).toHaveBeenCalledWith('style');
                Promise.all([read('test/res/expected/style_compact_margin.css'), read(stylePath)]).then((files) => {
                    expect(files[0]).toEqual(files[1]);
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });
        });

        describe('without margin', () => {
            const stylePath = './test/res/style_compact.css';
            const imagePath = './test/res/sprite_compact.png';
            const retinaImagePath = './test/res/sprite_compact@2x.png';
            const spriteOpts = {
                retina,
                dest: imagePath,
                retinaDest: retinaImagePath
            };
            const styleOpts = {
                retina,
                imagePath,
                retinaImagePath,
                source: imgDir,
                banner: false
            };
            beforeAll((done) => {
                spyOn(methods, 'reportError').and.callThrough();
                spyOn(methods, 'reportOk').and.callThrough();
                generateSprite(imgDir, { ...spriteOpts, margin: 0 }).then((data) => {
                    methods.reportOk('sprite');
                    return generateStyle(data[0], { ...styleOpts, stylePath });
                }, (err) => {
                    methods.reportError();
                    done.fail(err);
                }).then((data) => {
                    methods.reportOk('style');
                    done();
                }, (err) => {
                    methods.reportError();
                    done.fail(err);
                });
            });
        
            it('should generate sprite successfully.', (done) => {
                expect(methods.reportError).not.toHaveBeenCalled();
                expect(methods.reportOk).toHaveBeenCalledWith('sprite');
                Promise.all([read('test/res/expected/sprite_compact.png'), read('test/res/expected/sprite_compact@2x.png'), read(imagePath), read(retinaImagePath)]).then((files) => {
                    expect(files[0]).toEqual(files[2]);
                    expect(files[1]).toEqual(files[3]);
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });

            it('should generate style successfully.', (done) => {
                expect(methods.reportError).not.toHaveBeenCalled();
                expect(methods.reportOk).toHaveBeenCalledWith('style');
                Promise.all([read('test/res/expected/style_compact.css'), read(stylePath)]).then((files) => {
                    expect(files[0]).toEqual(files[1]);
                    done();
                }).catch((err) => {
                    done.fail(err);
                });
            });
        });
    });

    describe('sprite of "vertical" type', () => {
        const stylePath = './test/res/style_vertical.css';
        const imagePath = './test/res/sprite_vertical.png';
        const retinaImagePath = './test/res/sprite_vertical@2x.png';
        const spriteOpts = {
            retina,
            dest: imagePath,
            retinaDest: retinaImagePath
        };
        const styleOpts = {
            retina,
            imagePath,
            retinaImagePath,
            source: imgDir,
            banner: false
        };
        beforeAll((done) => {
            spyOn(methods, 'reportError').and.callThrough();
            spyOn(methods, 'reportOk').and.callThrough();
            generateSprite(imgDir, { ...spriteOpts, margin: 0, arrangement: 'vertical' }).then((data) => {
                methods.reportOk('sprite');
                return generateStyle(data[0], { ...styleOpts, stylePath });
            }, (err) => {
                methods.reportError();
                done.fail(err);
            }).then((data) => {
                methods.reportOk('style');
                done();
            }, (err) => {
                methods.reportError();
                done.fail(err);
            });
        });
    
        it('should generate sprite successfully.', (done) => {
            expect(methods.reportError).not.toHaveBeenCalled();
            expect(methods.reportOk).toHaveBeenCalledWith('sprite');
            Promise.all([read('test/res/expected/sprite_vertical.png'), read('test/res/expected/sprite_vertical@2x.png'), read(imagePath), read(retinaImagePath)]).then((files) => {
                expect(files[0]).toEqual(files[2]);
                expect(files[1]).toEqual(files[3]);
                done();
            }).catch((err) => {
                done.fail(err);
            });
        });

        it('should generate style successfully.', (done) => {
            expect(methods.reportError).not.toHaveBeenCalled();
            expect(methods.reportOk).toHaveBeenCalledWith('style');
            Promise.all([read('test/res/expected/style_vertical.css'), read(stylePath)]).then((files) => {
                expect(files[0]).toEqual(files[1]);
                done();
            }).catch((err) => {
                done.fail(err);
            });
        });
    });

    describe('sprite of "horizontal" type', () => {
        const stylePath = './test/res/style_horizontal.css';
        const imagePath = './test/res/sprite_horizontal.png';
        const retinaImagePath = './test/res/sprite_horizontal@2x.png';
        const spriteOpts = {
            retina,
            dest: imagePath,
            retinaDest: retinaImagePath
        };
        const styleOpts = {
            retina,
            imagePath,
            retinaImagePath,
            source: imgDir,
            banner: false
        };
        beforeAll((done) => {
            spyOn(methods, 'reportError').and.callThrough();
            spyOn(methods, 'reportOk').and.callThrough();
            generateSprite(imgDir, { ...spriteOpts, margin: 6, arrangement: 'horizontal' }).then((data) => {
                methods.reportOk('sprite');
                return generateStyle(data[0], { ...styleOpts, stylePath });
            }, (err) => {
                methods.reportError();
                done.fail(err);
            }).then((data) => {
                methods.reportOk('style');
                done();
            }, (err) => {
                methods.reportError();
                done.fail(err);
            });
        });
    
        it('should generate sprite successfully.', (done) => {
            expect(methods.reportError).not.toHaveBeenCalled();
            expect(methods.reportOk).toHaveBeenCalledWith('sprite');
            Promise.all([read('test/res/expected/sprite_horizontal.png'), read('test/res/expected/sprite_horizontal@2x.png'), read(imagePath), read(retinaImagePath)]).then((files) => {
                expect(files[0]).toEqual(files[2]);
                expect(files[1]).toEqual(files[3]);
                done();
            }).catch((err) => {
                done.fail(err);
            });
        });

        it('should generate style successfully.', (done) => {
            expect(methods.reportError).not.toHaveBeenCalled();
            expect(methods.reportOk).toHaveBeenCalledWith('style');
            Promise.all([read('test/res/expected/style_horizontal.css'), read(stylePath)]).then((files) => {
                expect(files[0]).toEqual(files[1]);
                done();
            }).catch((err) => {
                done.fail(err);
            });
        });
    });

    describe('sprite without retina', () => {
        const imagePath = './test/res/sprite_normal.png';
        const spriteOpts = {
            retina: false,
            dest: imagePath,
            filter(filepath) {
                return !/@2x.png/.test(filepath);
            }
        };

        beforeAll((done) => {
            spyOn(methods, 'reportError').and.callThrough();
            spyOn(methods, 'reportOk').and.callThrough();
            generateSprite(imgDir, spriteOpts).then((data) => {
                methods.reportOk('sprite');
                expect(data.length).toEqual(1);
                done();
            }, (err) => {
                methods.reportError();
                done.fail(err);
            });
        });
    
        it('should only generate normal sprite image.', (done) => {
            expect(methods.reportError).not.toHaveBeenCalled();
            expect(methods.reportOk).toHaveBeenCalledWith('sprite');
            Promise.all([read('test/res/expected/sprite_compact.png'), read(imagePath)]).then((files) => {
                expect(files[0]).toEqual(files[1]);
                done();
            }).catch((err) => {
                done.fail(err);
            });
        });
    });

    describe('sprite with different compression level', () => {
        const imagePath = './test/res/sprite_normal_no_compression.png';
        const spriteOpts = {
            retina: false,
            dest: imagePath,
            filter(filepath) {
                return !/@2x.png/.test(filepath);
            }
        };

        beforeAll((done) => {
            spyOn(methods, 'reportError').and.callThrough();
            spyOn(methods, 'reportOk').and.callThrough();
            generateSprite(imgDir, { ...spriteOpts, compression: 'none' }).then((data) => {
                methods.reportOk('sprite');
                expect(data.length).toEqual(1);
                done();
            }, (err) => {
                methods.reportError();
                done.fail(err);
            });
        });
    
        it('should generate sprite image of bigger size when set compression to "none".', (done) => {
            expect(methods.reportError).not.toHaveBeenCalled();
            expect(methods.reportOk).toHaveBeenCalledWith('sprite');
            Promise.all([read('test/res/expected/sprite_compact.png'), read(imagePath)]).then((files) => {
                expect(files[1].length).toBeGreaterThan(files[0].length);
                done();
            }).catch((err) => {
                done.fail(err);
            });
        });
    });
});
