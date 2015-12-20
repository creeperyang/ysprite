# ysprite

> A lightweight and powerful css sprite util.


## Features

1. Support both command line and node module.
2. Generate sprite and corresponding style automatically.
3. Support retina.
4. Write in ES2015.

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
    --style-path [path]  style path. defaults to ./sprite.css


# do sprite
ysprite -s images/icons -o image/sprite.png -r --style-path css/sprite.css
```

### Use as common node module

It's better install locally.

```bash
npm install ysprite
```

And then, just `require` as other modules.

```js
import { generateStyle, smartSprite } from 'ysprite';
```

**Note: `sprite` is wrote in `ES2015+`, so you may need `babel`.**


## License

MIT





