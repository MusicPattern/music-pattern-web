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

    await Promise.all((this.sounds || []).map(async sound => {
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

  trigger (time, event) {
    console.log('time', time, 'event', event)
    /*
    const {
      duration,
      interval,
      key
    } = event
    */
    //const triggeredSource = this.sourcesByPitchId[pitchId]
	  //triggeredSource && triggeredSource.start(time)
  }

  part (key, part) {
    console.log(this.name, 'key', key)
    if (this.partition[key]) {
      return this.partition[key]
    }

    const {
      indexes
    } = part

    console.log('indexes', indexes)
    let rootPitch, rootTime
    if (indexes[0] === 0) {
      if (indexes[1] === 0) {
        rootPitch = 12 * 4
        rootTime = 0
      } else {
        console.log('this.partition', this.partition)
        const previousPart = this.partition[`0/${indexes[1] - 1}`]
        console.log('previousPart', previousPart)
      }
    } else {
      const previousPatternIndex = Math.max(
        Object.values(this.partition)
          .filter(part => part.indexes[0] === indexes[0] - 1)
          .map(part => part.indexes[1])
      )
      const previousPart = this.partition[`${indexes[0] - 1}/${previousPatternIndex}`]
      console.log('previousPart', previousPart)
    }

    const events = part.events.map(event => ({ ...event }))

    events.forEach((event, index) => {
      const {
        duration,
        interval,
        pitch,
        time
      } = event
      if (!pitch) {
        event.pitch = index === 0
          ? rootPitch
          : events[index - 1].pitch + interval
      }
      if (!time) {
        event.time = index === 0
          ? rootTime
          : events[index - 1].time + duration
      }
    })

    const tonePart = new Tone.Part(
      (time, event) => this.trigger(time, event),
      events
    )
    Object.assign(tonePart, part)

    tonePart._events.forEach((_event, index) =>
      Object.assign(_event, events[index]))

    this.partition[key] = tonePart
  }
}
