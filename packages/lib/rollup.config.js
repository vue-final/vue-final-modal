import VuePlugin from 'rollup-plugin-vue'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import cleanup from 'rollup-plugin-cleanup'
import sizes from '@atomico/rollup-plugin-sizes'
import PostCSS from 'rollup-plugin-postcss'
import autoprefixer from 'autoprefixer'

import path from 'path'
import ts from 'rollup-plugin-typescript2'
import dts from 'rollup-plugin-dts'

const pkg = require('./package.json')
const resolve = _path => path.resolve(__dirname, _path)

const banner = `/**
 * ${pkg.name} v${pkg.version}
 * (c) ${new Date().getFullYear()}
 * 
 * @license MIT
 */
`

const plugins = [
  nodeResolve(),
  VuePlugin(),
  commonjs(),
  ts({
    check: true,
    tsconfig: './tsconfig.json',
    tsconfigOverride: {
      compilerOptions: {
        sourceMap: true,
        declaration: true,
        declarationMap: true
      },
      include: ['src/**/*.js'],
      exclude: ['node_modules']
    }
  }),
  PostCSS({
    plugins: [autoprefixer()]
  }),
  cleanup(),
  terser(),
  sizes()
]

export default [
  {
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
  },
  {
    input: 'dist/src/modalInstance.d.ts',
    output: [
      {
        file: 'types/index.d.ts',
        format: 'es',
        banner: `${banner}`
      }
    ],
    plugins: [dts()]
  }
]
