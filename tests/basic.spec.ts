import { assert } from 'chai'
import { Ludic } from '@src/main'

describe('Basic', ()=>{

  it('should probably work', async()=>{
    assert.equal(!!Ludic, true)
    assert.isUndefined(Ludic.$instance)
  })

})
