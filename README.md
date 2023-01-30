# sheetly

A simple library for creating CSSStyleSheet with CSS source code.

## Example

with tool chain|example
-|-
parcel|[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/s/github/DarrenDanielDay/sheetly/tree/main/examples/parcel)
vite|[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/DarrenDanielDay/sheetly/tree/main/examples/vite)
webpack|[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/DarrenDanielDay/sheetly/tree/main/examples/webpack)


## Install

```sh
npm install sheetly
```

`sheetly` ships a little bit browser runtime code to work, so it should not be in the `devDependencies` list.

## API

- `js`: generate JavaScript code in ESM format
- `ts`: generate TypeScript declaration code
- `create`: create `CSSStyleSheet` object with browser runtime
- `addSheet`: utility to add stylesheet to document or shadow root

Usage:

In your compiler:

```js
import { js, ts } from "sheetly/transpile";
import { readFile, writeFile } from "fs/promises";
const content = await readFile("/path/to/your.css", "utf-8");
// Generate JavaScript code.
await writeFile("/path/to/your.css.js", js(content));
// Generate TypeScript declaration file for better DX.
await writeFile("/path/to/your.css.d.ts", ts());
```

It will generate 2 files:

```js
// your.css.js
import { create } from "sheetly";
export let text = "the content of your css file";
export const sheet = create(text, import.meta.url);
```

```ts
// your.css.d.ts
export let text: string;
export const sheet: CSSStyleSheet;
```

And in your web application code, import the generated JavaScript file to use the `CSSStyleSheet` object.

```js
import { sheet } from "/path/to/your.css.js";
// `sheet` is the `CSSStyleSheet` object.
// You can add it to the document or a shadow root by adding it to `adoptedStyleSheets`
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet];
// You can also use the utility function provided by `sheetly` to do that:
import { addSheet } from "sheetly";
addSheet(sheet, document);
// You can omit the second parameter when you want to add the stylesheet to document.
addSheet(sheet);
```

If you do not want to get the type definitions without generating the TypeScript declaration file, you can add this `triple slash reference` to your project global declaration file:

```ts
/// <reference types="sheetly/client" />
```

This simple library is useful when you are using `CSSStyleSheet` with [`ShadowRoot.adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets) for building web components. The idea is simple, and the implementation is also simple.

`sheetly` does not minify the css code in the generated JavaScript code. Do not forget to minify for your production build before passing the code to the `js` API.

## CLI

For further integration, `sheetly` provides a CLI tool which will emit the JavaScript files for other tools. If you do not want to see those generated files in your source code folder, consider configuring you editor to exclude them, or writing a plugin for your compliler tool chain and use the APIs above.

Usage:

```txt
npx sheetly <command> <options>
# or you can create a script in your package.json with command `sheetly` to omit the `npx`
```

There are 2 commands.

- build: generate code once and exit
- watch: generate code once, then watch changes and generate for the updated files

Options:

```txt
  -d, --dir <string>  directory to search css files
  -t, --types         whether to generate declaration files (default: true)
  --hmr <string>      optional HMR code type. surpported values:
                      parcel, vite, webpack
```

The `--hmr` option is only available for `watch` command. When specified, `sheetly` will add `HMR` code in the generated JavaScript code.



## Known issues

Currently `@import` rules are not supported. If you want to reuse CSS rules, you can compose them by adding multiple sheet to the document or shadow root in JavaScript:

```js
import {sheet as sheet1} from "./sheet1.css.js";
import {sheet as sheet2} from "./sheet2.css.js";
document.adoptedStyleSheets = [...document.adoptedStyleSheets, sheet1, sheet2];
```

Resources declared in `url()` are not bundled in the generated JavaScript code. It might be supported in the future.

## License

MIT
