import * as L from '@dist/ludic'

class BasicGame extends L.Ludic {
  public screenManager: L.ScreenManager

  constructor(config: L.LudicOptions = {}) {
    super(config)
    // this.screenManager = new L.ScreenManager(this)
    // this.screenManager.addScreen(new Screen())
  }

  public update(delta: number, time: number): void {
    // this.screenManager.update(delta)
  }
}


// Create the Game
let game = new BasicGame()

// Start the Game
game.start()
