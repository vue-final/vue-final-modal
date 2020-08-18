import vue from 'rollup-plugin-vue'
import babel from '@rollup/plugin-babel'
import resolve from 'rollup-plugin-node-resolve'
import commonJS from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup'

const pkg = require('./package.json')

const plugins = [
  resolve(),
  commonJS({
    include: 'node_modules/**'
  }),
  vue(),
  babel({ babelHelpers: 'bundled' }),
  cleanup(),
  terser()
]

export default {
  input: 'lib/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'VueFinalModal',
      sourcemap: true
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  plugins
}
