class Packer {
    /**
     * pack rects list
     * @param  {Array} rects (sorted) rect list, like: [{width: 100, height: 100}, ...]
     * @return {Object}       root container
     */
    pack(rects) {
        if (!rects || !rects.length) return;
        if (rects[0]) {
            this.root = {
                x: 0,
                y: 0,
                width: rects[0].width,
                height: rects[0].height
            };
        }
        let container;
        rects.forEach((rect) => {
            if (container = this.findContainer(this.root, rect.width,
                    rect.height)) {
                rect.pack = this.splitContainer(container, rect.width,
                    rect.height);
            } else {
                rect.pack = this.expandContainer(rect.width, rect.height);
            }
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
                    let bMax = b.width > b.height ? b.width : b.height;
                    let aMax = a.width > a.height ? a.width : a.height;
                    return bMax - aMax;
                });
                break;
            default:
                sorted = rects;
        }
        return sorted;
    }

    /**
     * find (rect) container for current rect
     * @param  {Object} root   root container
     * @param  {Number} width  current rect's width
     * @param  {Number} height current rect's height
     * @return {Object}        node
     */
    findContainer(root, width, height) {
        // recursive find
        if (root.used) {
            return this.findContainer(root.right, width, height) || this.findContainer(
                root.down, width, height);
            // if rect can be placed into root container (big enough)
        } else if (width <= root.width && height <= root.height) {
            return root;
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
            height: height
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
        let root = this.root;
        let canGrowDown = width <= root.width;
        let canGrowRight = height <= root.height;
        // attempt to keep square-ish
        let shouldGrowRight = canGrowRight && root.height >= (root.width +
            width);
        let shouldGrowDown = canGrowDown && root.width >= (root.height +
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
        let root = this.root;
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
                width: width,
                height: root.height
            }
        };
        let container = this.findContainer(this.root, width, height);
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
        let root = this.root;
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
                height: height
            }
        };
        let container = this.findContainer(this.root, width, height);
        return container ? this.splitContainer(container, width, height) :
            undefined;
    }
}

export default Packer;
