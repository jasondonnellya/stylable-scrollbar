// rollup.config.js

/**
 * https://github.com/ezolenko/rollup-plugin-typescript2/issues/211#issuecomment-603526125
 * Need to get types working because when importing using esm we get error mentioning that types are not available.
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
