# ysprite

[![Build Status](https://travis-ci.org/creeperyang/ysprite.svg?branch=master)](https://travis-ci.org/creeperyang/ysprite)

> A lightweight and powerful css sprite util.


## Features

1. Support both command line and node module.
2. Generate sprite and corresponding style automatically.
3. Support retina.
4. Write in `ES2015`.

## Installation & Usage

It's **simple** to install and use.

### Use as command line tool

It's suggested to install **globally** if you want to use cli everywhere.

```bash
npm install [-g] ysprite
```

And then, it's ready to use:

```bash
# see usage info
ysprite --help

  Usage: ysprite [options]

  Options:

    -h, --help           output usage information
    -V, --version        output the version number
    -s, --source <path>  set source images dir, defaults to ./
    -o, --output <path>  set sprite image path, defaults to ./sprite.png
    -r, --retina         enable retina mode.
    --no-style           disable generate style
    --style-path <path>  style path. defaults to ./sprite.css


# do sprite
ysprite -s images/icons -o image/sprite.png -r --style-path css/sprite.css
```

1. If you have a list of icons inside `images/icons` dir, both retina(`xx@2x.png`) and normal ones.
2. run `ysprite -s images/icons -o image/sprite.png -r --style-path css/sprite.css`. 
3. And then, you found both `sprite.png` and `sprite@2x.png` inside `image` dir. and `sprite.css` inside `css` dir.
4. Lastly, just include `css/sprite.css` into you html file and use with special `className`.

![demo](http://7sbnba.com1.z0.glb.clouddn.com/pic-sprite.jpg)


### Use as common node module

It's better install locally.

```bash
npm install ysprite
```

And then, just `require` as other modules.

```js
import { generateStyle, smartSprite } from 'ysprite';
```

**Note: `sprite` is wrote in `ES2015+`, so you need transform to `ES5` youself.**


## License

MIT
