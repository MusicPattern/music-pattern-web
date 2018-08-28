import Tone from 'tone'

import Dispatcher from './Dispatcher'
import { durationToToneDuration, pitchToToneNote } from './music'

export default class Section extends Dispatcher {
  constructor (part = {}, config) {
    super()
    Object.assign(this, part, config)
    this.isMuted = false
    this.isSetup = false
  }

  setup () {
    const {
      indexes,
      track
    } = this
    const {
      partition
    } = track
    let {
      rootDuration,
      rootInterval
    } = this

    if (indexes[0] === 0) {
      if (indexes[1] === 0) {
        rootInterval = typeof rootInterval !== "undefined"
          ? rootInterval
          : 12 * 4
        rootDuration = typeof rootDuration !== "undefined"
          ? rootDuration
          : 0
      } else {
        const previousSection = partition[`0/${indexes[1] - 1}`]
        if (previousSection) {
          const previousEvent = previousSection.events.slice(-1)[0]
          rootInterval = previousEvent.pitch
          rootDuration = previousEvent.time + Tone.Time(previousEvent.toneDuration)
                                                  .toSeconds()
        } else {
          console.log(`previousSection not found for ${this.name} 0/${indexes[1] - 1}`)
        }
      }
    } else {
      const previousPatternIndex = Math.max(
        ...Object.values(this.partition)
          .filter(part => part.indexes[0] === indexes[0] - 1)
          .map(part => part.indexes[1])
      )
      const previousSection = partition[`${indexes[0] - 1}/${previousPatternIndex}`]
      if (previousSection) {
        const previousEvent = previousSection.events.slice(-1)[0]
        rootInterval = previousEvent.pitch
        rootDuration = previousEvent.time + Tone.Time(previousEvent.toneDuration)
                                                .toSeconds()
      } else {
        console.log(`previousSection not found for ${this.name} ${indexes[0] - 1}/${previousPatternIndex}`)
      }
    }

    this.events = this.events.map(event => ({ ...event }))

    this.events.forEach((event, index) => {
      if (typeof event.interval === "undefined") {
        console.warn(`interval should not be undefined here in ${track.name} ${this.name}`)
        event.interval = 0
      }

      if (typeof event.pitch === "undefined") {
        event.pitch = index === 0
          ? rootInterval
          : this.events[index - 1].pitch + event.interval
      }

      if (typeof event.toneNote === "undefined") {
        event.toneNote = pitchToToneNote(event.pitch)
      }

      if (typeof event.toneDuration === "undefined") {
        event.toneDuration = durationToToneDuration(event.duration)
      }

      if (typeof event.time === "undefined") {
        if (index === 0) {
          event.time = Tone.Time(durationToToneDuration(rootDuration))
                           .toSeconds()
        } else {
          event.time = this.events[index - 1].time +
            Tone.Time(this.events[index - 1].toneDuration)
                .toSeconds()
        }
      }

      if (typeof event.probability === "undefined") {
        event.probability = 1
      }

      if (Math.random() <= event.probability) {
          this.track.toneInstrument.triggerAttackRelease(
            event.toneNote,
            event.toneDuration,
            event.time
          )
          event.toneEvent = new Tone.Event(
            time => {
              this.track.dispatch("attack")
              this.dispatch("attack")
            })
          event.toneEvent.start(event.time)
          Tone.Sequencer.times.push(event.time + Tone.Time(event.toneDuration).toSeconds())
      }

    })

    this.dispatch("setup")
    this.isSetup = true
    this.handleSetupSuccess && this.handleSetupSuccess()
    this.track.handleSectionSetupSuccess()

  }

  mute (isMuted) {
    this.events.forEach(event => event.mute = isMuted)
    this.isMuted = isMuted
    this.dispatch("mute")
  }
}
