/**
 * @license sheetly
 * Copyright (C) 2023  DarrenDanielDay <Darren_Daniel_Day@hotmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Generate the JavaScript code in ESM format.
 * @param code the css code
 * @returns the generated JavaScript code
 */
export const js = (code: string): string => {
  return `\
import { create } from "sheetly";
export let text = ${JSON.stringify(code)};
export const sheet = create(text, import.meta.url);
`
}

/**
 * Generate the TypeScript declaration code for the JavaScript code.
 * @returns the generated declaration code
 */
export const ts = (): string => {
  return `\
export declare let text: string;
export declare const sheet: CSSStyleSheet;
`
}