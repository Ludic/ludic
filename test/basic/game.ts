import * as L from '@dist/ludic'
import Screen from './screen'

class BasicGame extends L.Game {
  public screenManager: L.ScreenManager

  constructor(config: LudicAppConfig = {}) {
    super(config)
    this.screenManager = new L.ScreenManager(this)
    this.screenManager.addScreen(new Screen())
  }

  public update(delta: number, time: number): void {
    this.screenManager.update(delta)
  }
}


// Create a new BasicGame
let game = new BasicGame()

// Run the Game
game.update()
