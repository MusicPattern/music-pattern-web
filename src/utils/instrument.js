import Tone from 'tone'

import { context } from './audio'

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
function pitchIndexToTone (index) {
  const levelIndex = Math.floor(index / 12)
  const noteIndex = index % 12
  return `${notes[noteIndex]}${levelIndex}`
}


export default class Instrument {
  constructor (instrument = {}) {
    Object.assign(this, instrument)
    this.isSetup = false
    this.partition = {}
  }

  async setup () {
    this.sourcesByPitchId = {}

    await Promise.all(this.sounds.map(async sound => {
      const { pitchId, sample } = sound

      let source
      if (sample) {
        const response = await fetch(sample.url)
        const decode = () => new Promise(resolve => {
          response.arrayBuffer().then(arrayBuffer => {
            context.decodeAudioData(arrayBuffer, resolve)
          })
        })
        const decodedAudioData = await decode()

        source = context.createBufferSource()
        source.buffer = decodedAudioData
        source.connect(context.destination)
      }

      this.sourcesByPitchId[pitchId] = source
    }))

    this.isSetup = true

    this.handleSetupSuccess && this.handleSetupSuccess()
    this.player.handleInstrumentSetupSuccess()
  }

  trigger (time, pitchId) {
     const triggeredSource = this.sourcesByPitchId[pitchId]
	   triggeredSource && triggeredSource.start(time)
  }

  part (key, part) {
    if (this.partition[key]) {
      return this.partition[key]
    }

    const tonePart = new Tone.Part(
      (time, pitch) => {
        console.log('time', time, 'pitch', pitch)
        this.trigger(time, pitch)
      },
      part.events.map(event => [event.duration, pitchIndexToTone(event.pitch)])
    )

    tonePart.start(part.time)

    this.partition[key] = tonePart
  }
}
