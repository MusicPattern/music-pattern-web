import Tone from 'tone'

import Dispatcher from './dispatcher'
import Part from './part'
import { pitchToToneNote } from './music'

export default class Instrument extends Dispatcher {
  constructor (instrument = {}, config) {
    super()
    Object.assign(this, instrument, config)
    this.isMuted = false
    this.isPartsSetup = false
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

    this.dispatch("setup")
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

    if (part) {
			const newPart = new Part(part, { instrument: this })
			newPart.setup()
			this.partition[key] = newPart
			return newPart
		}
  }

  handlePartSetupSuccess () {
		if (Object.values(this.partition).every(part => part.isSetup)) {
			this.isPartsSetup = true
			this.dispatch("parts-setup")
		}
	}

  removePart(key) {
    const part = this.partition[key]
    if (!part) {
      return
    }
    part.events.forEach(event => event.toneEvent.dispose())
    key && delete this.partition[key]
    this.dispatch('removePart')
  }

  cancel () {
    delete this.partition
    this.partition = {}
  }

  mute (isMuted) {
    Object.values(this.partition).forEach(part => part.mute(isMuted))
    this.isMuted = isMuted
    this.dispatch("mute")
  }
}
