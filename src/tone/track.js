import Tone from 'tone'

import Dispatcher from './Dispatcher'
import Section from './Section'
import { pitchToToneNote } from './music'

export default class Track extends Dispatcher {
  constructor (instrument = {}, config) {
    super()
    Object.assign(this, instrument, config)
    this.isMuted = false
    this.isSectionsSetup = false
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
    Tone.Sequencer.handleTrackSetupSuccess()
  }

  section (key, part) {
    if (!this.isSetup) {
      console.log(`instrument ${this.name} is not setup to do a part`)
      return
    }

    if (this.partition[key]) {
      return this.partition[key]
    }

    if (part) {
			const newSection = new Section(part, { track: this })
			newSection.setup()
			this.partition[key] = newSection
			return newSection
		}
  }

  handleSectionSetupSuccess () {
		if (Object.values(this.partition).every(part => part.isSetup)) {
			this.isSectionsSetup = true
			this.dispatch("sections-setup")
		}
	}

  removeSection(key) {
    const section = this.partition[key]
    if (!section) {
      return
    }
    section.events.forEach(event => event.toneEvent.dispose())
    key && delete this.partition[key]
    this.dispatch('removeSection')
  }

  cancel () {
    delete this.partition
    this.partition = {}
  }

  mute (isMuted) {
    Object.values(this.partition).forEach(section => section.mute(isMuted))
    this.isMuted = isMuted
    this.dispatch("mute")
  }
}
