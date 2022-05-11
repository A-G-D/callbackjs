# CallbackJS

> Javascript library that provides common features for building callbacks/handlers/listeners.

[![NPM](https://img.shields.io/npm/v/component.svg)](https://www.npmjs.com/package/component) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @callbackjs/callback
```

or

```bash
yarn add @callbackjs/callback
```

## Usage

```ts
import { Callback } from '@callbackjs/callback'

const callback = new Callback()

callback.add((arg) => {
  console.log(`Callback 1: ${arg}`)
})
callback.add((arg) => {
  console.log(`Callback 2: ${arg}`)
})

callback('Hello')
// This will print:
//  Callback 1: Hello
//  Callback 2: Hello
```

## Contributing

Pull Requests are Welcome.

## License

This repository is released under [MIT License](LICENSE).
