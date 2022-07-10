// @ts-check
const path = require('path')
const { defineConfig } = require('vite')

module.exports = defineConfig(({command, mode})=>{


  /** @type {import('vite').UserConfig} */
  const config = {
    build: {
      emptyOutDir: false,
      lib: {
        entry: path.resolve(__dirname, 'src/main.ts'),
        name: 'ludic',
        fileName: (format) => mode === 'development' ? `ludic.dev.${format}.js` : `ludic.${format}.js`,
      },
      rollupOptions: {
        // make sure to externalize deps that shouldn't be bundled
        // into your library
        // external: ['vue'],
        // output: {
        //   // Provide global variables to use in the UMD build
        //   // for externalized deps
        //   globals: {
        //     vue: 'Vue'
        //   }
        // }
      },
    },
    define: {
      __vite_process_env_NODE_ENV: JSON.stringify('process.env.NODE_ENV'),
    },
    resolve: {
      alias: {},
    },
  }
  
  if(mode === 'development'){
    console.log('dev mode')
    // @ts-ignore
    config.define['import.meta.hot'] = 'import.meta.hot'
    // @ts-ignore
    config.resolve.alias['@ludic/ein'] = path.resolve(__dirname, 'node_modules/@ludic/ein/dist/ein.dev.es.js')
  }

  return config
})