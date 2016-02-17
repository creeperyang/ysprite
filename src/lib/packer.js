class Packer {
    /**
     * pack rects list
     * @param  {Array} rects sorted rect list, like: [{width: 100, height: 100}, ...]
     * @return {Object}      pack info object, like: { x, y, width, height, right, down} (right/down is the same type object)
     */
    pack(rects) {
        if (!rects || !rects.length || typeof rects[0] !== 'object') return false;
        this.root = {
            x: 0,
            y: 0,
            width: rects[0].width,
            height: rects[0].height
        };
        rects.forEach((rect) => {
            let container = this.findContainer(this.root, rect.width, rect.height);
            rect.pack = container ? this.splitContainer(container, rect.width, rect.height) :
                this.expandContainer(rect.width, rect.height);
        });
        return this.root;
    }

    /**
     * sort rect list
     * @param  {Array} rects rect list
     * @param  {String} type  sort type, defaults to 'none'.
     *                        Other values are 'maxSide'|'width'|'height'|'area'
     * @return {Array}       sorted array
     */
    static sort(rects, type = 'none') {
        let sorted;
        switch (type) {
            case 'width':
                sorted = rects.sort((a, b) => b.width - a.width);
                break;
            case 'height':
                sorted = rects.sort((a, b) => b.height - a.height);
                break;
            case 'area':
                sorted = rects.sort((a, b) => b.height * b.width - a.height * a.width);
                break;
            case 'maxSide':
                sorted = rects.sort((a, b) => {
                    const bMax = b.width > b.height ? b.width : b.height;
                    const aMax = a.width > a.height ? a.width : a.height;
                    return bMax - aMax;
                });
                break;
            default:
                sorted = rects;
        }
        return sorted;
    }

    /**
     * vertical pack rect list
     * @param  {Array}   rects  rect list, like: [{width: 100, height: 100}, ...]
     * @param  {Boolean} sorted whether the lib is sorted by width, default is false
     * @return {Object}         the container, like: {width, height}
     */
    static verticalPack(rects, sorted = false) {
        if (!rects || !rects.length || typeof rects[0] !== 'object') return false;
        if (!sorted) rects = Packer.sort(rects, 'width');
        const widestRect = rects[0];
        let trackY = widestRect.height;
        // widestRect.x = widestRect.y = 0;
        widestRect.pack = {
            x: 0,
            y: 0
        };
        rects.slice(1).forEach((rect) => {
            //rect.x = 0;
            //rect.y = trackY;
            rect.pack = {
                x: 0,
                y: trackY
            };
            trackY += rect.height;
        });
        return {
            width: widestRect.width,
            height: trackY
        };
    };

    /**
     * horizontal pack rect list
     * @param  {Array}   rects  rect list, like: [{width: 100, height: 100}, ...]
     * @param  {Boolean} sorted whether the lib is sorted by height, default is false
     * @return {Object}         the container, like: {width, height}
     */
    static horizontalPack(rects, sorted = false) {
        if (!rects || !rects.length || typeof rects[0] !== 'object') return false;
        if (!sorted) rects = Packer.sort(rects, 'height');
        const highestRect = rects[0];
        let trackX = highestRect.width;
        // highestRect.x = highestRect.y = 0;
        highestRect.pack = {
            x: 0,
            y: 0
        };
        rects.slice(1).forEach((rect) => {
            //rect.x = trackX;
            //rect.y = 0;
            rect.pack = {
                x: trackX,
                y: 0
            };
            trackX += rect.width;
        });
        return {
            width: trackX,
            height: highestRect.height
        };
    };

    /**
     * find unused container for current rect
     * @param  {Object} container container to start find
     * @param  {Number} width     current rect's width
     * @param  {Number} height    current rect's height
     * @return {Object}           appropriate container for current rect
     */
    findContainer(container, width, height) {
        // recursive find
        if (container.used) {
            return this.findContainer(container.right, width, height) || this.findContainer(
                container.down, width, height);
            // if rect can be placed into container (big enough)
        } else if (width <= container.width && height <= container.height) {
            return container;
        }
    }

    /**
     * split container to 3 parts, one for/equals current rect, then left down and right rect.
     * @param  {Object} container   container
     * @param  {Number} width       rect's width
     * @param  {Number} height      rect's height
     * @return {Object}             container
     */
    splitContainer(container, width, height) {
        container.used = true;
        container.down = {
            x: container.x,
            y: container.y + height,
            width: container.width,
            height: container.height - height
        };
        container.right = {
            x: container.x + width,
            y: container.y,
            width: container.width - width,
            height
        };
        return container;
    }

    /**
     * expand container to place new rect
     * @param  {Number} width  rect's width
     * @param  {Number} height rect's height
     * @return {Object}        expanded container or undefined
     */
    expandContainer(width, height) {
        const root = this.root;
        const canGrowDown = width <= root.width;
        const canGrowRight = height <= root.height;
        // attempt to keep square-ish
        const shouldGrowRight = canGrowRight && root.height >= (root.width +
            width);
        const shouldGrowDown = canGrowDown && root.width >= (root.height +
            height);
        return shouldGrowRight ? this.expandRight(width, height) :
            shouldGrowDown ? this.expandDown(width, height) :
            canGrowRight ? this.expandRight(width, height) :
            canGrowDown ? this.expandDown(width, height) : undefined;
    }

    /**
     * expand container to right side
     * @param  {Number} width  rect's width
     * @param  {Number} height rect's height
     * @return {Object}        expanded container
     */
    expandRight(width, height) {
        const root = this.root;
        // reset root, and set orginal root to down
        this.root = {
            x: 0,
            y: 0,
            used: true,
            width: root.width + width,
            height: root.height,
            down: root,
            right: {
                x: root.width,
                y: 0,
                width,
                height: root.height
            }
        };
        const container = this.findContainer(this.root, width, height);
        return container ? this.splitContainer(container, width, height) :
            undefined;
    }

    /**
     * expand container to down side
     * @param  {Number} width  rect's width
     * @param  {Number} height rect's height
     * @return {Object}        expanded container
     */
    expandDown(width, height) {
        const root = this.root;
        // reset root, and set orginal root to right
        this.root = {
            x: 0,
            y: 0,
            used: true,
            height: root.height + height,
            width: root.width,
            right: root,
            down: {
                x: 0,
                y: root.height,
                width: root.width,
                height
            }
        };
        const container = this.findContainer(this.root, width, height);
        return container ? this.splitContainer(container, width, height) :
            undefined;
    }
}

export default Packer;
