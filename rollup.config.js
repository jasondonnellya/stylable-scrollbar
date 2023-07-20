// rollup.config.js
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
    typescript({
        tsconfig: './configs/tsconfig.base.json',
    }),
    terser()
  ],
};
