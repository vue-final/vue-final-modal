import VuePlugin from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import sizes from '@atomico/rollup-plugin-sizes'
import PostCSS from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

const pkg = require('./package.json')

const plugins = [
  nodeResolve(),
  VuePlugin(),
  commonjs(),
  PostCSS({
    plugins: [autoprefixer()]
  }),
  cleanup(),
  terser(),
  sizes()
]

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'umd',
      name: 'VueFinalModal',
      sourcemap: true,
      exports: 'named',
      globals: {
        vue: 'Vue',
        '@vueuse/core': 'VueUse'
      }
    },
    {
      file: pkg.module,
      format: 'es',
      sourcemap: true
    }
  ],
  external: ['vue', '@vueuse/core'],
  plugins
}
