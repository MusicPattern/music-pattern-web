import Tone from 'tone'

import { context } from './audio'

/*
const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
function pitchIndexToTone (index) {
  const levelIndex = Math.floor(index / 12)
  const noteIndex = index % 12
  return `${notes[noteIndex]}${levelIndex}`
}
*/

window.Tone = Tone

export default class Instrument {
  constructor (instrument = {}) {
    Object.assign(this, instrument)
    this.isSetup = false
    this.partition = {}
    this.control = {}
  }

  async setup () {
    await Promise.all((this.sounds || []).map(async sound => {
      const { pitch, sample } = sound

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

      this.control[pitch] = source
    }))

    this.isSetup = true
    this.handleSetupSuccess && this.handleSetupSuccess()
    Tone.Player.handleInstrumentSetupSuccess()
  }

  trigger (time, event) {
    console.log('time', time, 'event', event, this.sourcesByPitchId)
    const {
      pitch
    } = event
    this.control[pitch].start()
  }

  part (key, part) {

    if (this.partition[key]) {
      return this.partition[key]
    }

    const {
      indexes
    } = part

    let rootPitch, rootTime
    if (indexes[0] === 0) {
      if (indexes[1] === 0) {
        rootPitch = 12 * 4
        rootTime = 0
      } else {
        const previousPart = this.partition[`0/${indexes[1] - 1}`]
        if (previousPart) {
          const previousEvent = previousPart._events.slice(-1)[0]
          rootPitch = previousEvent.value.pitch
          rootTime = previousEvent.time
        } else {
          console.warn(`previousPart not found for 0/${indexes[1] - 1}`)
        }
      }
    } else {
      const previousPatternIndex = Math.max(
        ...Object.values(this.partition)
          .filter(part => part.indexes[0] === indexes[0] - 1)
          .map(part => part.indexes[1])
      )
      const previousPart = this.partition[`${indexes[0] - 1}/${previousPatternIndex}`]
      if (previousPart) {
        const previousEvent = previousPart._events.slice(-1)[0]
        rootPitch = previousEvent.value.pitch
        rootTime = previousEvent.time
      } else {
        console.warn(`previousPart not found for ${indexes[0] - 1}/${previousPatternIndex}`)
      }
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
          ? 0
          //: Tone.Time(`${events[index - 1].time} + ${1/duration}n`)
          : events[index - 1].time + 1/duration
      }
    })

    const tonePart = new Tone.Part(
      (time, event) => this.trigger(time, event),
      events
    )
    Object.assign(tonePart, part)

    tonePart._events.forEach((_event, index) =>
      Object.assign(_event, events[index]))

    tonePart.start(rootTime)

    this.partition[key] = tonePart
  }
}
