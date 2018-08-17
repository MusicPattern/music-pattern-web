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

  part (time, rhythm, melody) {
    if (this.partition[time]) {
      // TODO DELETE
    }

    const part = new Tone.Part(
      (time, pitch) => {
        console.log('time', time, 'pitch', pitch)
        this.trigger(time, pitch)
      },
      this.zip(rhythm, melody)
    )

    part.start(time)

    this.partition[time] = part
  }

  zip (rhythm, melody) {

    let durations, intervals
    if (!rhythm && melody) {
      intervals = melody.pattern.split(',')
      durations = Array(intervals.length).fill(1)
    } else if (rhythm && !melody) {
      durations = rhythm.pattern.split(',')
      intervals = Array(durations.length).fill(0)
    } else {
      intervals = melody.pattern.split(',')
      durations = rhythm.pattern.split(',')
    }
    intervals = intervals.map(interval => parseInt(interval))
    console.log(melody, 'intervals', intervals)

    const pitches = Array(durations.length).fill(0)
    intervals.forEach((interval, index) =>
      pitches[index] = index === 0
        ? 0
        : pitches[index - 1] + interval
    )
    const tones = pitches.map(pitchIndexToTone)

    // console.log('durations', durations)
    console.log('tones', tones)

    const zip = durations.map((duration, index) =>
                  [duration, tones[index]])
    console.log('zip', zip, this.id, melody.name)
    return zip
  }
}
