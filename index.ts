/**
 * @license sheetly
 * Copyright (C) 2023  DarrenDanielDay <Darren_Daniel_Day@hotmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * Create a CSSStyleSheet.
 * @param code the css code
 * @param baseURL optional base url if you want to use `url()` in it
 * @returns a created style sheet
 */
export const create = (code: string, baseURL?: string): CSSStyleSheet => {
  const sheet = new CSSStyleSheet({ baseURL });
  sheet.replaceSync(code);
  return sheet;
};

/**
 * Add a CSSStyleSheet to the given document.
 * @param sheet the CSSStyleSheet object or a list of them
 * @param doc the document or shadow root
 */
export const addSheet = (
  sheet: CSSStyleSheet | CSSStyleSheet[],
  doc: DocumentOrShadowRoot = document
): void => {
  doc.adoptedStyleSheets = doc.adoptedStyleSheets.concat(sheet);
};

/**
 * Create style sheet with `String.raw`, just for css syntax highlight with some editors.
 * `baseURL` will always be undefined.
 * @param template A well-formed template string call site representation.
 * @param substitutions A set of substitution values.
 * @returns `CSSStyleSheet` created with template string
 */
export const css = (
  templates: TemplateStringsArray,
  ...substitutions: any[]
): CSSStyleSheet => create(String.raw(templates, ...substitutions));
