import Tone from 'tone'

const notes = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
function pitchToToneNote (index) {
  const levelIndex = Math.floor(index / 12)
  const noteIndex = index % 12
  return `${notes[noteIndex]}${levelIndex}`
}
function durationToToneDuration (number) {
  console.log('number', number)
  if (number >= 1) {
    return `${number}m`
  } else {
    return `${1/number}n`
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

    this.toneInstrument = new Tone[this.toneName]().toMaster()
    this.toneInstrument.sync()

    this.isSetup = true
    this.handleSetupSuccess && this.handleSetupSuccess()
    Tone.Pattern.handleInstrumentSetupSuccess()
  }

  /*
  trigger (time, event, part) {
    const {
      duration,
      pitch
    } = event

    const toneDuration = durationToToneDuration(duration)
    const toneNote = pitchToToneNote(pitch)

    console.log('OUAI',
      this.toneInstrument,
      toneNote,
      toneDuration,
      time
    )

    this.toneInstrument.triggerAttackRelease(toneNote, "8n", time)


  }
  */

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
          const previousEvent = previousPart._events.slice(-1)[0]
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
        const previousEvent = previousPart._events.slice(-1)[0]
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
        duration,
        interval,
        pitch,
        time
      } = event
      if (typeof pitch === "undefined") {
        event.pitch = index === 0
          ? rootInterval
          : events[index - 1].pitch + interval
        event.toneNote = pitchToToneNote(event.pitch)
      }
      if (typeof time === "undefined") {
        event.toneDuration = durationToToneDuration(duration)
        if (index === 0) {
          event.time = Tone.Time(rootDuration)
                           .toSeconds()
        } else {
          event.time = events[index - 1].time +
            Tone.Time(events[index - 1].toneDuration)
                .toSeconds()
        }
      }
    })



    events.forEach(event => {
      const {
        time,
        toneNote
      } = event

      console.log('toneNote', toneNote, 'time', time)

      this.toneInstrument.triggerAttackRelease(toneNote, "8n", time)
    })



    /*
    Tone.Transport.schedule(function(time){
    	//do something with the time
    }, "16:0:0");

    console.log('events', events)

    const tonePart = new Tone.Part(
      (time, event) => this.trigger(time, event, part),
      events
    )
    Object.assign(tonePart, part)
    */
    /*
    tonePart._events.forEach((_event, index) =>
      Object.assign(_event, events[index]))

    tonePart.start(rootDuration)

    this.partition[key] = tonePart
    */
  }

  cancel () {
    delete this.partition
    this.partition = {}
  }
}
