import VuePlugin from 'rollup-plugin-vue'
import PostCSS from 'rollup-plugin-postcss'
import NodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import babel from '@rollup/plugin-babel'
import cleanup from 'rollup-plugin-cleanup'
import { terser } from 'rollup-plugin-terser'
import sizes from '@atomico/rollup-plugin-sizes'

const pkg = require('./package.json')

const plugins = [
  NodeResolve(),
  commonjs(),
  VuePlugin(),
  babel({ babelHelpers: 'bundled' }),
  cleanup(),
  terser(),
  // Process only `<style module>` blocks.
  PostCSS({
    modules: {
      generateScopedName: '[local]___[hash:base64:5]'
    },
    include: /&module=.*\.css$/
  }),
  // Process all `<style>` blocks except `<style module>`.
  PostCSS({ include: /(?<!&module=.*)\.css$/ }),
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
  external(id) {
    return /^(vue)$/.test(id)
  }
}
