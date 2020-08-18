import vue from 'rollup-plugin-vue';
import babel from '@rollup/plugin-babel';
import { terser } from 'rollup-plugin-terser';
import cleanup from 'rollup-plugin-cleanup';

const pkg = require('./package.json');

const external = Object.keys(pkg.dependencies);
const plugins = [
  vue(),
  babel({ babelHelpers: 'bundled' }),
  cleanup(),
  terser(),
];

export default {
  input: 'lib/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'VueFinalModal',
      sourcemap: true,
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true,
    },
  ],
  plugins,
  external,
};
