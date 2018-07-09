![](https://raw.githubusercontent.com/sammarks/art/master/object-reference/header.jpg)

[![CircleCI](https://circleci.com/gh/sammarks/object-reference/tree/master.svg?style=svg)](https://circleci.com/gh/sammarks/object-reference/tree/master)

Object reference allows you to build objects that reference themselves.

## Get Started

```sh
npm install --save object-reference
```

```js
const resolve = require('object-reference')

const theme = {
  colors: {
    black: '#424242',
    white: '#FFF'
  },
  background: '$.colors.white',
  foreground: '$.colors.black',
  margins: {
    page: '30px'
  }
}

const processedTheme = resolve(theme)
console.log(processedTheme)

// {
//   colors: {
//     black: '#424242',
//     white: '#FFF'
//   },
//   background: '#FFF',
//   foreground: '#424242',
//   margins: {
//     page: '30px'
//   }
// }
```

## Features

- Uses `_.get()` from [Lodash](https://github.com/lodash/lodash) under the hood.
- Detects circular references and throws a detailed error message explaining the situation.
- Resolves nested references (references that reference other references).

## Why use this?

I've found the perfect use-case to be defining configuration in a single object, with common
variables like colors or sizes at the top of the configuration file, and then specific overrides
underneath that reference the variables by default.

This allows the user to have the simplicity of changing a few variables at the top of the document
to make a sweeping impact, or getting fine-grained and changing small values toward the bottom
of the document.
