import Tone from 'tone'

import Instrument from './instrument'

window.Tone = Tone

export default class Pattern {
	constructor() {
		this.band = {}
		this.subscribers = {}
		this.isPart = false
    this.isSetup = false
	}

	connect (key, callback) {
		this.subscribers[key] = callback
	}

	dispatch (action) {
		Object.values(this.subscribers).forEach(callback => callback(action))
	}

	instrument(key, instrument) {
		if (this.band[key]) {
			return this.band[key]
		}
		if (instrument) {
			const newInstrument = new Instrument(instrument)
			newInstrument.setup()
			this.band[key] = newInstrument
			return newInstrument
		}
	}

	handleInstrumentSetupSuccess () {
		if (Object.values(this.band).every(instrument => instrument.isSetup)) {
			this.isSetup = true
			this.dispatch("setup")
		}
	}

	loop () {
		Tone.Transport.loop = !Tone.Transport.loop
		this.dispatch("loop")
	}

	part () {
		Tone.Transport.cancel()
		Object.values(this.band).forEach(instrument => {
			instrument.cancel()
		})
		this.isPart = true
		this.dispatch("part")
	}

	start () {

		if (!this.isSetup) {
			console.log('Tone Pattern not setup')
			return
		}

		Tone.Transport.stop()

		if (!this.isPart) {
			this.part()
		}

    Tone.Transport.start()

		this.isPlaying = true

		this.dispatch("start")
	}

	stop () {
		Tone.Transport.stop()

		this.isPlaying = false

		this.dispatch("stop")
	}

}

Tone.Pattern = new Pattern()
