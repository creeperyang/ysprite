import Packer from '../../src/util/packer';

describe('Packer lib', () => {
    describe('static sort method', () => {
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

    describe('instance pack method', () => {
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
    });
});