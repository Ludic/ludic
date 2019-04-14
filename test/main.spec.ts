import { assert } from 'chai'
import * as L from '@dist/ludic.commonjs.js'

describe('basic', ()=>{
  it('should exist', async()=>{
    assert.equal(!!L, true)
  })
})
