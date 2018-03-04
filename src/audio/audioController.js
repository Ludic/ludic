// Play Audio


class AudioController {
  constructor() {
    window.AudioContext = window.AudioContext || window.webkitAudioContext
    this.ac = new AudioContext()
    this.playing = {}
  }

  playSound(arrayBuffer){
    let source = this.ac.createBufferSource()
    source.buffer = arrayBuffer
    source.connect(this.ac.destination)
    source.start(0)
  }

}


export default new AudioController()
