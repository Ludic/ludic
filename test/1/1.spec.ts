import * as L from '@dist/ludic'

console.log("Ludic", L)


class BasicGame extends L.Ludic.Ludic {
  constructor(config: L.LudicOptions) {
    super(config)
  }
}

// const game = new BasicGame({})
