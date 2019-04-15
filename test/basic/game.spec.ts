import { assert } from 'chai'
import * as puppeteer from 'puppeteer'
import * as Ludic from '@dist/ludic.commonjs.js'

describe('basic game', ()=>{
  it('should work in a browser', async()=>{
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    await page.addScriptTag({ path: './dist/ludic.umd.js' })
    let results = await page.evaluate(() => {

      var canvas = document.createElement('canvas')
      canvas.id = 'canvas'
      document.body.appendChild(canvas)

      class BasicGame extends Ludic.Ludic {
        constructor(config: Ludic.LudicOptions) {
          super(config)
        }
      }
      return new BasicGame({el: "canvas"})
    })

    await browser.close()
    assert.equal(!!results, true)
  })
})
