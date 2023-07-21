// rollup.config.js

/**
 * I preferably wanted to output this with best possible practices, so including the index.d.ts files,
 * but rollup does not really have a way to do that which I've found. It would work with tsc.
 */

const prefix = "dist";
import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';

export default {
  input: "./src/index.ts",
  output: [
    {
      file: `${prefix}/cjs/index.cjs.js`,
      format: "cjs",
    },
    {
      file: `${prefix}/esm/index.esm.js`,
      format: "esm",
    },
    {
      name: "initStylableScrollbars",
      file: `${prefix}/umd/index.umd.js`,
      format: "umd",
    },
  ],
  plugins: [
    typescript(),
    terser()
  ],
};
