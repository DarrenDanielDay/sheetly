/**
 * @license sheetly
 * Copyright (C) 2023  DarrenDanielDay <Darren_Daniel_Day@hotmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Create a CSSStyleSheet.
 * @param {string} code the css code
 * @param {string} baseURL the base url if you want to use `@import`
 * @returns a created style sheet
 */
export const create = (code: string, baseURL: string): CSSStyleSheet => {
  const sheet = new CSSStyleSheet({ baseURL });
  sheet.replaceSync(code);
  return sheet;
};

/**
 * Add a CSSStyleSheet to the given document.
 * @param sheet the CSSStyleSheet object
 * @param doc the document or shadow root
 */
export const addSheet = (
  sheet: CSSStyleSheet,
  doc: DocumentOrShadowRoot = document
): void => {
  doc.adoptedStyleSheets = [...doc.adoptedStyleSheets, sheet];
};
