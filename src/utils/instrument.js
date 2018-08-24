import Tone from 'tone'

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
function pitchToToneNote (index) {
  const levelIndex = Math.floor(index / 12)
  const noteIndex = index % 12
  return `${notes[noteIndex]}${levelIndex}`
}
function durationToToneDuration (number) {

  if (number === 0) {
    return "0m"
  }

  /*
  if (number >= 1) {
    return `${number}m`
  } else {
    return `${1/number}n`
  }
  */

  /*
  if (number >= 2) {
    return `${number-1}m`
  } else {
    return `${2/number}n`
  }
  */

  if (number >= 4) {
    return `${number-2}m`
  } else {
    return `${4/number}n`
  }
}

export default class Instrument {
  constructor (instrument = {}) {
    Object.assign(this, instrument)
    this.isSetup = false
    this.partition = {}
  }

  async setup () {

    if (!Tone[this.toneName]) {
      console.warn(`No Tone instrument for ${this.toneName}`)
      return
    }

    const args = []
    if (this.toneName === "Sampler") {
      const toneNoteToSampleUrl = {}
      this.sounds.forEach(sound => {
        const { pitch, sample } = sound
        const toneNote = pitchToToneNote(pitch)
        toneNoteToSampleUrl[toneNote] = sample.url
      })
      args.push(toneNoteToSampleUrl)
    }

    this.toneInstrument = new Tone[this.toneName](...args).toMaster()
    this.toneInstrument.sync()

    this.isSetup = true
    this.handleSetupSuccess && this.handleSetupSuccess()
    Tone.Pattern.handleInstrumentSetupSuccess()
  }

  part (key, part) {

    if (!this.isSetup) {
      console.log(`instrument ${this.name} is not setup to do a part`)
      return
    }

    if (this.partition[key]) {
      return this.partition[key]
    }

    const {
      indexes
    } = part
    let {
      rootDuration,
      rootInterval
    } = part

    if (indexes[0] === 0) {
      if (indexes[1] === 0) {
        rootInterval = typeof rootInterval !== "undefined"
          ? rootInterval
          : 12 * 4
        rootDuration = typeof rootDuration !== "undefined"
          ? rootDuration
          : 0
      } else {
        const previousPart = this.partition[`0/${indexes[1] - 1}`]
        if (previousPart) {
          const previousEvent = previousPart.events.slice(-1)[0]
          rootInterval = previousEvent.pitch
          rootDuration = previousEvent.time + Tone.Time(previousEvent.toneDuration)
                                                  .toSeconds()
        } else {
          console.log(`previousPart not found for ${this.name} 0/${indexes[1] - 1}`)
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
        const previousEvent = previousPart.events.slice(-1)[0]
        rootInterval = previousEvent.pitch
        rootDuration = previousEvent.time + Tone.Time(previousEvent.toneDuration)
                                                .toSeconds()
      } else {
        console.log(`previousPart not found for ${this.name} ${indexes[0] - 1}/${previousPatternIndex}`)
      }
    }

    const events = part.events.map(event => ({ ...event }))

    events.forEach((event, index) => {
      const {
        duration
      } = event
      let {
        interval,
        pitch,
        probability,
        time
      } = event

      if (typeof interval === "undefined") {
        console.warn(`interval should not be undefined here in ${this.name} ${part.name}`)
        interval = 0
      }

      if (typeof pitch === "undefined") {
        pitch = index === 0
          ? rootInterval
          : events[index - 1].pitch + interval
      }

      const toneNote = pitchToToneNote(pitch)
      const toneDuration = durationToToneDuration(duration)

      if (typeof time === "undefined") {
        if (index === 0) {
          time = Tone.Time(durationToToneDuration(rootDuration))
                     .toSeconds()
        } else {
          time = events[index - 1].time +
            Tone.Time(events[index - 1].toneDuration)
                .toSeconds()
        }
      }

      event.pitch = pitch
      event.time = time
      event.toneDuration = toneDuration

      if (Math.random() <= probability) {
        this.toneInstrument.triggerAttackRelease(toneNote, toneDuration, time)
      }
    })

    this.partition[key] = Object.assign({}, part, { events })

  }

  cancel () {
    delete this.partition
    this.partition = {}
  }
}
