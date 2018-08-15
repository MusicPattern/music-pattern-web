import get from 'lodash.get'
import Tone from 'tone'

import { context } from './audio'

export default class Instrument {
  constructor (instrument = {}, config = {}) {
    this.sounds =  instrument.sounds
    this.isReady =  false
  }

  check () {
    for (let sound of this.sounds) {
      if (sound.sample && !sound.sample.decodedAudioData) {
        return
      }
    }
    this.isReady = true
  }

  setup () {
    this.sourcesByPitchId = {}
    this.sounds.forEach(sound => {
      let source
      const decodedAudioData = get(sound, 'sample.decodedAudioData')
      if (decodedAudioData) {
        source = context.createBufferSource()
        source.buffer = decodedAudioData
        source.connect(context.destination)
      }
      this.sourcesByPitchId[sound.pitchId] = source
    })
  }

  trigger (time, pitchId) {
	   this.setup()
     const triggeredSource = this.sourcesByPitchId[pitchId]
	   triggeredSource && triggeredSource.start(time)
  }

  part (time, rhythm, melodie) {

    this.part = new Tone.Part(
      function(time, pitch){
        console.log('time', time, 'pitch', pitch)
        this.trigger(time, pitch)
      },
      this.zip(rhythm, melodie)
    )

    this.part.start(time)
  }

  zip (rhythm, melodie) {
    const melodie_pitches = melodie.pattern.split(',')
    return rhythm.pattern.split(',').map((duration, index) =>
      [duration, melodie_pitches[index]])
  }
}
