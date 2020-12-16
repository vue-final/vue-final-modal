import NodeResolve from '@rollup/plugin-node-resolve'
import cleanup from 'rollup-plugin-cleanup'
import { terser } from 'rollup-plugin-terser'
import VuePlugin from 'rollup-plugin-vue'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import PostCSS from 'rollup-plugin-postcss'
import sizes from '@atomico/rollup-plugin-sizes'

const pkg = require('./package.json')

const plugins = [
  NodeResolve(),
  VuePlugin(),
  cleanup(),
  terser(),
  PostCSS(),
  commonjs(),
  babel({
    babelHelpers: 'bundled',
    extensions: ['.js', '.jsx', '.es6', '.es', '.mjs', '.vue']
  }),
  sizes()
]

export default {
  input: 'lib/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'VueFinalModal',
      sourcemap: true,
      globals: {
        vue: 'Vue'
      }
    },
    {
      file: pkg.module,
      format: 'esm',
      sourcemap: true
    }
  ],
  plugins,
  external: ['vue']
}
