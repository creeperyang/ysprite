import { generateStyle, smartSprite } from '../../src/index.js';
import { read } from '../../src/util/fs-promise';

describe('Main Function (gen sprite and style)', () => {
    const options = {
        retina: true,
        style: true,
        stylePath: './test/res/sprite.css',
        source: './test/res/icons',
        output: './test/res/sprite.png'
    };
    let methods = {
        reportError() {},
        reportOk(which) {}
    };

    beforeAll((done) => {
        spyOn(methods, 'reportError').and.callThrough();
        spyOn(methods, 'reportOk').and.callThrough();
        smartSprite(options.source, options.output, options.retina).then((data) => {
            methods.reportOk('sprite');
            return generateStyle(options.output, options.stylePath, data[0], true, {
                retina: options.retina
            });
        }, (err) => {
            methods.reportError();
            done(err);
        }).then((data) => {
            methods.reportOk('style');
            done();
        }, (err) => {
            methods.reportError();
            done(err);
        });
    });
    
    it('should generate sprite successfully.', (done) => {
        expect(methods.reportError).not.toHaveBeenCalled();
        expect(methods.reportOk).toHaveBeenCalledWith('sprite');
        Promise.all([read('test/res/expected/sprite.png'), read('test/res/expected/sprite@2x.png'), read('test/res/sprite.png'), read('test/res/sprite@2x.png')]).then((files) => {
            expect(files[0]).toEqual(files[2]);
            expect(files[1]).toEqual(files[3]);
            done();
        });
    });

    it('should generate style successfully.', (done) => {
        expect(methods.reportError).not.toHaveBeenCalled();
        expect(methods.reportOk).toHaveBeenCalledWith('style');
        Promise.all([read('test/res/expected/sprite.css'), read('test/res/sprite.css')]).then((files) => {
            expect(files[0].replace(/\/\*[\s\S]+\*\//, '')).toEqual(files[1].replace(/\/\*[\s\S]+\*\//, ''));
            done();
        });
    });
});
