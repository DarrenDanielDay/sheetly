/**
 * @license MIT
 * Copyright (C) 2023  DarrenDanielDay <Darren_Daniel_Day@hotmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Generate the JavaScript code in ESM format.
 * @param {string} code the css code
 */
export const js = (code) => {
  return `\
import { create } from "sheetly";
export let text = ${JSON.stringify(code)};
export const sheet = create(text, import.meta.url);
`
}

/**
 * Generate the TypeScript declaration code for the JavaScript code.
 * @returns {string}
 */
export const ts = () => {
  return `\
export declare let text: string;
export declare const sheet: CSSStyleSheet;
`
}

/**
 * Create a CSSStyleSheet.
 * @param {string} code the css code
 * @param {string} baseURL the base url if you want to use `@import`
 * @returns a created style sheet
 */
export const create = (code, baseURL) => {
  const sheet = new CSSStyleSheet({ baseURL })
  sheet.replaceSync(code);
  return sheet;
}