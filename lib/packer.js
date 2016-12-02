class Packer {
    /**
     * sort rect list
     * @param  {Array} rects  rect list
     * @param  {String} type  sort type, defaults to 'none'.
     *                        Other values are 'maxSide'|'width'|'height'|'area'
     * @return {Array}        sorted array
     */
    static sort (rects, type = 'none') {
        let sorted
        switch (type) {
            case 'width':
                sorted = rects.sort((a, b) => b.width - a.width)
                break
            case 'height':
                sorted = rects.sort((a, b) => b.height - a.height)
                break
            case 'area':
                sorted = rects.sort((a, b) => b.height * b.width - a.height * a.width)
                break
            case 'maxSide':
                sorted = rects.sort((a, b) => {
                    const bMax = b.width > b.height ? b.width : b.height
                    const aMax = a.width > a.height ? a.width : a.height
                    return bMax - aMax
                })
                break
            default:
                sorted = rects
        }
        return sorted
    }

    /**
     * pack rect list vertically, get the corresponding container
     * @param  {Array}   rects  rect list, shape is [{width: 100, height: 100}, ...]
     * @param  {Boolean} sorted whether the lib is sorted by width, default is false
     * @return {Object}         the container, shape is {width, height}
     */
    static verticalPack (rects, sorted = false) {
        if (!rects || !rects.length) return false
        if (!sorted) rects = Packer.sort(rects, 'width')
        const widestRect = rects[0]
        let trackY = widestRect.height
        widestRect.pack = {
            x: 0,
            y: 0
        }
        rects.slice(1).forEach(rect => {
            rect.pack = {
                x: 0,
                y: trackY
            }
            trackY += rect.height
        })
        return {
            width: widestRect.width,
            height: trackY
        }
    }

    /**
     * pack rect list horizontally, get the corresponding container
     * @param  {Array}   rects  rect list, shape is [{width: 100, height: 100}, ...]
     * @param  {Boolean} sorted whether the lib is sorted by height, default is false
     * @return {Object}         the container, shape is {width, height}
     */
    static horizontalPack (rects, sorted = false) {
        if (!rects || !rects.length) return false
        if (!sorted) rects = Packer.sort(rects, 'height')
        const highestRect = rects[0]
        let trackX = highestRect.width
        highestRect.pack = {
            x: 0,
            y: 0
        }
        rects.slice(1).forEach(rect => {
            rect.pack = {
                x: trackX,
                y: 0
            }
            trackX += rect.width
        })
        return {
            width: trackX,
            height: highestRect.height
        }
    }

    /**
     * pack rects list compactly, get the corresponding container
     * @param  {Array}   rects  sorted rect list, shape is [{width: 100, height: 100}, ...]
     * @param  {Boolean} sorted whether the lib is sorted, default is false
     * @return {Object}         the container with more properties,
     *                          shape: { x, y, width, height, right, down}
     *                          right/down is of the same shape
     */
    static compactPack (rects, sorted = false) {
        if (!rects || !rects.length) return false
        if (!sorted) rects = Packer.sort(rects, 'maxSide')
        const packer = new Packer()
        packer.root = {
            x: 0,
            y: 0,
            width: rects[0].width,
            height: rects[0].height
        }
        rects.forEach(rect => {
            // find an unused container
            const container = packer.findContainer(packer.root, rect.width, rect.height)
            rect.pack = container
                // if container found, use it
                ? packer.useContainer(container, rect.width, rect.height)
                // else expand a container
                : packer.expandContainer(rect.width, rect.height)
        })
        return packer.root
    }

    /**
     * Find unused container for current rect (width x height)
     * @param  {Object} container container to start find
     * @param  {Number} width     current rect's width
     * @param  {Number} height    current rect's height
     * @return {Object}           appropriate container for current rect
     */
    findContainer (container, width, height) {
        // if container is used, then check right and down container,
        // find corresponding container to use.
        if (container.used) {
            return this.findContainer(container.right, width, height) ||
                this.findContainer(container.down, width, height)
        }
        // if rect can be placed into container (and surely not used),
        // return this container
        else if (width <= container.width && height <= container.height) {
            return container
        }
        // otherwise return undefined (we find no container)
    }

    /**
     * Use container (for current rect).
     * Split container to 3 parts, one equals current rect, and use it.
     * Then down and right rect (can used by other rects).
     * @param  {Object} container   container
     * @param  {Number} width       current rect's width
     * @param  {Number} height      current rect's height
     * @return {Object}             container
     */
    useContainer (container, width, height) {
        container.used = true
        container.down = {
            x: container.x,
            y: container.y + height,
            width: container.width,
            height: container.height - height
        }
        container.right = {
            x: container.x + width,
            y: container.y,
            width: container.width - width,
            height
        }
        return container
    }

    /**
     * Expand root (container) to place current rect
     * @param  {Number} width  current rect's width
     * @param  {Number} height current rect's height
     * @return {Object}        expanded container or undefined
     */
    expandContainer (width, height) {
        const root = this.root
        const canGrowDown = width <= root.width
        const canGrowRight = height <= root.height
        // attempt to keep square-ish
        const shouldGrowRight = canGrowRight &&
            root.height >= (root.width + width)
        const shouldGrowDown = canGrowDown &&
            root.width >= (root.height + height)
        return shouldGrowRight
            ? this.expandRight(width, height)
            : shouldGrowDown
            ? this.expandDown(width, height)
            : canGrowRight
            ? this.expandRight(width, height)
            : canGrowDown
            ? this.expandDown(width, height)
            : null
    }

    /**
     * expand container to right side
     * @param  {Number} width  rect's width
     * @param  {Number} height rect's height
     * @return {Object}        expanded container
     */
    expandRight (width, height) {
        const root = this.root
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
        }
        const container = this.findContainer(this.root, width, height)
        return container
            ? this.useContainer(container, width, height)
            : null
    }

    /**
     * expand container to down side
     * @param  {Number} width  rect's width
     * @param  {Number} height rect's height
     * @return {Object}        expanded container
     */
    expandDown (width, height) {
        const root = this.root
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
        }
        const container = this.findContainer(this.root, width, height)
        return container
            ? this.useContainer(container, width, height)
            : null
    }
}

Packer.pack = Packer.compactPack

module.exports = Packer
