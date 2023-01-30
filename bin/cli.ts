#!/usr/bin/env node
/**
 * @license sheetly
 * Copyright (C) 2023  DarrenDanielDay <Darren_Daniel_Day@hotmail.com>
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// @ts-check
import { readFile, writeFile } from "fs/promises";
import { watch } from "chokidar";
import { default as CleanCSS } from "clean-css";
import G from "glob";
import { promisify } from "util";
import { program } from "commander";
import { js, ts } from "../transpile.js";
import { hmrCode, type HMRType } from "../hmr.js";
import { resolve } from "path";
const packageJson: typeof import("../package.json") = JSON.parse(
  await readFile(resolve(process.cwd(), "package.json"), "utf-8")
);
const glob = promisify(G.glob);

type CLIOptions = {
  dir: string;
  types: boolean;
  hmr?: HMRType;
};

type EmitConfig = {
  mode: "development" | "production";
  file: string;
  types: boolean;
  hmr?: HMRType;
};

const emit = async ({ file, types, hmr, mode }: EmitConfig) => {
  const src = await readFile(file, "utf-8");
  const styles =
    mode === "production"
      ? (
          await new CleanCSS({
            returnPromise: true,
          }).minify(src)
        ).styles
      : src;
  const jsFile = `${file}.js`;
  let jsCode = js(styles);
  if (typeof hmr === "string" && hmr in hmrCode) {
    jsCode += hmrCode[hmr];
  }
  const tasks = [writeFile(jsFile, jsCode, "utf-8")];
  if (types) {
    const tsCode = ts();
    const tsFile = `${file}.d.ts`;
    tasks.push(writeFile(tsFile, tsCode, "utf-8"));
  }
  await Promise.all(tasks);
};

const build = async ({ dir, types, hmr }: CLIOptions) => {
  const files = await glob(`${dir}/**/*.css`);
  await Promise.all(
    files.map((file) => emit({ file, types, hmr, mode: "production" }))
  );
};

program
  .name("sheetly")
  .description(
    `\
CLI to generate JavaScript file and TypeScript declarationn
for creating CSSStyleSheet with CSS source files.
`
  )
  .version(packageJson.version);

program
  .command("build")
  .requiredOption("-d, --dir <string>", "directory to search css files")
  .option("-t, --types", "whether to generate declaration files", true)
  .action(build);

program
  .command("watch")
  .requiredOption("-d, --dir <string>", "directory to search css files")
  .option("-t, --types", "whether to generate declaration files", true)
  .option(
    "--hmr <string>",
    `optional HMR code type. surpported values: parcel, vite, webpack`,
    undefined
  )
  .action(async ({ dir, types, hmr }) => {
    await build({ dir, types, hmr });
    watch(dir).on("all", (_, file) => {
      if (!file.endsWith(".css")) {
        return;
      }
      emit({ file, types, hmr, mode: "development" });
    });
  });

program.parse();
