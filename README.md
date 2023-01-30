# sheetly

A simple library for creating CSSStyleSheet with css code.

## API

- `js` for generating JavaScript code in ESM format
- `ts` for generating TypeScript declaration code
- `create` for the browser runtime

Usage:

In your compiler:

```js
import { js, ts } from "sheetly/transpile";
import { readFile, writeFile } from "fs/promises";
const content = await readFile("/path/to/your.css", 'utf-8');
// Generate JavaScript code. 
// If you want `@import` or `url()` rules to work currectly, you should put the output file in the same directory with the source file.
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

If you do not want to get the type definitions without generating the TypeScript declaration file, you can add this `triple slash reference` to your project global declaration file:

```ts
/// <reference types="sheetly/client" />
```

This simple library is useful when you are using `CSSStyleSheet` with [`ShadowRoot.adoptedStyleSheets`](https://developer.mozilla.org/en-US/docs/Web/API/ShadowRoot/adoptedStyleSheets) for building web components. The idea is simple, and the implementation is also simple.

`sheetly` does not minify the css code in the generated JavaScript code. Do not forget to minify for your production build before passing the code to the `js` API.

## License

MIT
