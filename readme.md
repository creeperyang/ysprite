# ysprite

[![npm version](https://badge.fury.io/js/ysprite.svg)](https://badge.fury.io/js/ysprite)
[![Build Status](https://travis-ci.org/creeperyang/ysprite.svg?branch=master)](https://travis-ci.org/creeperyang/ysprite)
[![Coverage Status](https://coveralls.io/repos/github/creeperyang/ysprite/badge.svg?branch=master)](https://coveralls.io/github/creeperyang/ysprite?branch=master)
[![Dependency Status](https://david-dm.org/creeperyang/ysprite.svg)](https://david-dm.org/creeperyang/ysprite)
[![devDependency Status](https://david-dm.org/creeperyang/ysprite/dev-status.svg)](https://david-dm.org/creeperyang/ysprite#info=devDependencies)
[![npm](https://img.shields.io/npm/dm/ysprite.svg)](https://www.npmjs.com/package/ysprite)

> A lightweight and powerful css sprite util.

## Install

[![NPM](https://nodei.co/npm/ysprite.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/ysprite/)

## Usage

**Use Cli:**

If you want to use the cli everywhere, install **globally** (`npm install -g ysprite`).

And then, it's ready to use:

![usage](https://cloud.githubusercontent.com/assets/8046480/13146118/2b79cffc-d68f-11e5-9f01-aab511aedc90.gif)

**Use API:**

```js
// es6+ with babel6+
import { generateStyle, generateSprite } from 'ysprite';

// normal require
var Sprite = require('ysprite');
Sprite.generateSprite(dir, opts);
Sprite.generateStyle(list, opts);
```

More info about [API](https://github.com/creeperyang/ysprite/wiki/API).

## License

MIT
