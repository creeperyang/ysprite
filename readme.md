# ysprite

[![npm version](https://badge.fury.io/js/ysprite.svg)](https://badge.fury.io/js/ysprite)
[![Build Status](https://travis-ci.org/creeperyang/ysprite.svg?branch=master)](https://travis-ci.org/creeperyang/ysprite)
[![Coverage Status](https://coveralls.io/repos/github/creeperyang/ysprite/badge.svg?branch=master)](https://coveralls.io/github/creeperyang/ysprite?branch=master)
[![Dependency Status](https://david-dm.org/creeperyang/ysprite.svg)](https://david-dm.org/creeperyang/ysprite)
[![devDependency Status](https://david-dm.org/creeperyang/ysprite/dev-status.svg)](https://david-dm.org/creeperyang/ysprite#info=devDependencies)
[![npm](https://img.shields.io/npm/dm/ysprite.svg)](https://www.npmjs.com/package/ysprite)

> A lightweight yet powerful css sprite util.

## Install

[![NPM](https://nodei.co/npm/ysprite.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ysprite/)

**Note:**

Core dependency `lwip@0.0.9` depends on `C++11` compiler, so you should install `gcc/g++-4.8` or something like first.

## Usage

`ysprite` has a built-in cli, so you can use both cli and node API.

### Use Cli

If you want to use the cli everywhere, install **globally** (`npm i -g ysprite`).

And then, it's ready to use:

```bash
  ysprite -s test/res/icons -o .tmp/x.png --out-style .tmp/x.css

  Sprite successfully!
    image: .tmp/x.png  retina: .tmp/x@2x.png  style: .tmp/x.css
```

### Use API

```js
import sprite, { generateStyle, generateSprite } from 'ysprite';

// sprite is sprite options, style is style options
sprite(imgGlob|dir, { sprite, style }).then(({
    image, // Buffer, normal image
    retina, // Buffer, retina image
    imagePath,
    retinaImagePath,
    style, // String, css
    stylePath
}) => {
    // do something
})

generateSprite(imagePathList, spriteOpts).then(data => {
    return generateStyle(data[0].source, styleOpts)
}).then(style => console.log(style))
```

#### sprite(imgGlob, { sprite, style })

- `imgGlob` could be `dir` (like `images/icons`) or `glob` (like `images/icons/**/*.png`)

    And when you use dir, it's equal glob `dir/**/*.png`

- `sprite` and `style` are options, described below.

- return a promise, and you could get an object like:

    ```js
    {
        image, // Buffer, normal image
        retina, // Buffer, retina image
        imagePath, // image path
        retinaImagePath, // retina image path
        style, // String, css
        stylePath // style path
    }
    ```

##### sprite options

```js
{
    imagePath, // required, dest image path
    retinaImagePath, // dest retina image path
    retina, // whether to enable retina mode
    filter, // filter out normal image
    retinaFilter, // filter out retina image
    writeToFile, // whether write sprite image to file
    margin = 0, // margin between icons
    compression = 'high', // output png compression, one of ['none', 'fast', 'high']
    interlaced = false, // whether enable png interlaced
    arrangement = 'compact' // arrangement of images: 'vertical'|'horizontal'|'compact'
}
```

##### style options

```js
{
    connector = '-', // className connector, default to "-"
    prefix = 'icon', // className prefix, default to "icon"
    suffix = '', // className suffix
    eol, // new line
    retina = false, // whether generate retina style
    writeToFile = false, // whether write style to file
    stylePath, // style path
    imagePath, // image path
    retinaImagePath, // retina image path
    banner = false // banner
}
```

- Icon's className is composed by `prefix + connector + name + suffix`, so `play.png` will be `.icon-play` with default option.
- `eol`'s default value is `require('os').EOL`, so `\r\n` in `Windows`.
- `banner` could be string (be put in head with origin text), `true` (a timestamp), and false (no banner).


#### generateSprite(imagePathList, options)

- `imagePathList` should be array of image path.
- `options` is sprite options described above.
- return a promise, and you can get data:

```js
{
    // every single icon's info, like [{ x, y, margin, width, height, path }],
    // used by generateStyle
    source,
    path, // image path
    params, // { compression, interlaced: true|false, transparency: true}
    image, // it's lwip's image, you can do some magic thing with it.
    width, // image width
    height // image height
}
```

#### generateStyle(imageInfoList, options)

- `imageInfoList` should be array of image info, generated by `generateStyle`
- `options` is style options described above.
- return a promise, and you can get the style content.

## License

MIT
