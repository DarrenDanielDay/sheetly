#!/usr/bin/env node
// @ts-check
import { readFile, writeFile } from "fs/promises";
import { watch } from "chokidar";
import { default as CleanCSS } from "clean-css";
import G from "glob";
import { promisify } from "util";
import { program } from "commander";
import packageJson from "../package.json" assert { type: "json" };
import { js, ts } from "../transpile.js";
import { hmrCode, type HMRType } from "../hmr.js";

const glob = promisify(G.glob);

type CLIOptions = {
  dir: string;
  types: boolean;
  hmr?: HMRType;
};

type EmitConfig = {
  file: string;
  types: boolean;
  hmr?: HMRType;
};

const emit = async ({ file, types, hmr }: EmitConfig) => {
  const src = await readFile(file, "utf-8");
  const { styles } = await new CleanCSS({
    returnPromise: true,
  }).minify(src);
  const jsFile = `${file}.js`;
  let jsCode = js(styles);
  if (typeof hmr === "string" && hmr in hmrCode) {
    jsCode += hmrCode[hmr];
  }
  const tasks =  [writeFile(jsFile, jsCode, "utf-8")];
  if (types) {
    const tsCode = ts();
    const tsFile = `${file}.d.ts`;
    tasks.push(writeFile(tsFile, tsCode, "utf-8"));
  }
  await Promise.all(tasks);
};

const build = async ({ dir, types, hmr }: CLIOptions) => {
  const files = await glob(`${dir}/**/*.css`);
  await Promise.all(files.map((file) => emit({ file, types, hmr })));
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
  .option("--hmr <string>", `optional HMR code type. surpported values: parcel, vite, webpack`, undefined)
  .action(async ({ dir, types, hmr }) => {
    await build({ dir, types, hmr });
    watch(dir).on("all", (_, file) => {
      if (!file.endsWith(".css")) {
        return;
      }
      emit({ file, types, hmr });
    });
  });

program.parse();
