# ysprite

[![npm version](https://badge.fury.io/js/ysprite.svg)](https://badge.fury.io/js/ysprite)
[![Build Status](https://travis-ci.org/creeperyang/ysprite.svg?branch=master)](https://travis-ci.org/creeperyang/ysprite)
[![Coverage Status](https://coveralls.io/repos/github/creeperyang/ysprite/badge.svg?branch=master)](https://coveralls.io/github/creeperyang/ysprite?branch=master)
[![Dependency Status](https://david-dm.org/creeperyang/ysprite.svg)](https://david-dm.org/creeperyang/ysprite)
[![devDependency Status](https://david-dm.org/creeperyang/ysprite/dev-status.svg)](https://david-dm.org/creeperyang/ysprite#info=devDependencies)
[![npm](https://img.shields.io/npm/dm/ysprite.svg)](https://www.npmjs.com/package/ysprite)

> A lightweight and powerful css sprite util.


**Features:**

1. Support both command line and node module.
2. Generate sprite and corresponding style automatically.
3. Support retina.
4. Write in `ES2015`.

## Installation & Usage

[![NPM](https://nodei.co/npm/ysprite.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ysprite/)

### Use as command line tool

It's suggested to install **globally** if you want to use as cli everywhere.

```bash
npm install -g ysprite
```

And then, it's ready to use:

```bash
# see usage info
$ ysprite --help

  Usage: ysprite [options]

  Options:

    -h, --help                     output usage information
    -V, --version                  output the version number
    -s, --source [path]            required, set source images dir
    -o, --output [path]            required, set sprite image path
    --output-retina <path>         set retina sprite image path. defaults to same with normal path and add "@2x" to filename
    --style-path [path]            set style path. ok to with .less/scss extension
    --compression <level>          set png compression level. one of ["none", "fast", "high"], defaults to "high"
    --margin [number]              set margin between images. defaults to 0, prefer even number
    --filter [regexp]              set normal image filter.
    --retina-filter [regexp]       set retina image filter.
    --arrangement [arrange]        set arrangement of images. one of ["compact", "vertical", "horizontal"], defaults to "compact"
    --style-prefix [prefix]        set style className prefix, defaults to "icon"
    --style-connector [connector]  set style className connector, defaults to "-"
    --style-suffix [suffix]        set style className suffix, defaults to ""
    --style-banner                 enable style banner, defaults to false
    --no-interlaced                disable png interlace
    -R, --no-retina                disable retina mode.
    --no-style                     disable generate style

  Examples:

    $ ysprite -s img/icons -o img/sprite.png --output-retina img/sprite@2x.png --style-path css/sprite.css --compression high --margin 10
    $ ysprite -s img/icons -o img/sprite.png --no-retina --no-style
    $ ysprite -s img/icons -o img/sprite.png --style-path sprite.less --style-prefix ico --style-connector __


  Author: creeperyang <pashanhu6@hotmail.com>
```


### Use as common node module

```js
// es6+ with babel6+
import { generateStyle, generateSprite } from 'ysprite';

// normal require
var generateSprite = require('ysprite').default;
var Sprite = require('ysprite');
Sprite.generateSprite(dir, opts);
Sprite.generateStyle(list, opts);
```

#### API

1. `generateSprite(sourceList, options)`

    * @param  {Array|String} sourceList             source images list, or source image dir

    * @param  {Object}       options                setting:

        - {String}       options.dest           required, dest image path

        - {String}       options.retinaDest     dest retina image path

        - {Boolean}      options.retina         whether to enable retina mode

        - {Function}     options.filter         filter out normal image

        - {Function}     options.retinaFilter   filter out retina image

        - {Number}       options.margin         margin between icons

        - {Boolean}      options.compression    output png compression, oneof ['none', 'fast', 'high']

        - {Boolean}      options.interlaced     enable png interlaced

        - {String}       options.arrangement    arrangement of images: 'vertical'|'horizontal'|'compact'

    * @return {Object}                              promise

2. `genrateStyle(infoList, options)`

    * @param  {Array}   infoList                The images (merged to sprite) info list, generated by `generateSprite`

    * @param  {Object}  options                 options

        - {String}  options.connector       className connector, default to "-"

        - {String}  options.prefix          className prefix, default to "icon"

        - {String}  options.suffix          className suffix

        - {Boolean} options.retina          generate retina style

        - {Boolean} options.writeToFile     whether write style to file

        - {String}  options.stylePath       style path

        - {String}  options.imagePath       image path

        - {String}  options.retinaImagePath retina image path

        - {Boolean} options.banner          whether write banner to style

    * @return {String}                          generated style text

## License

MIT
