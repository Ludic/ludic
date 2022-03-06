import typescript from 'rollup-plugin-typescript2'
import resolve from '@rollup/plugin-node-resolve'

export default {
  input: 'src/main.ts',
  output: [
    {
      format: 'commonjs',
      file: 'dist/ludic.js',
      name: 'ludic',
      exports: 'named',
    },
    {
      format: 'es',
      file: 'dist/ludic.es.js',
      name: 'ludic',
      exports: 'named',
    },
    {
      format: 'iife',
      file: 'dist/ludic.iife.js',
      name: 'ludic',
      exports: 'named',
    },
    {
      format: 'umd',
      file: 'dist/ludic.umd.js',
      name: 'ludic',
      exports: 'named',
    },
  ],
  plugins: [
    typescript(),
    resolve(),
  ],
  external: [
    'vue'
  ],
};
