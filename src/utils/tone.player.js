import Tone from 'tone'

import Instrument from './instrument'

export default class Player {
	constructor() {
		this.band = {}
		this.subscribers = {}
		this.isPart = false
    this.isSetup = false
		this.isSource = false
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

	source () {
		Object.values(this.band).forEach(instrument => {
			instrument.source()
		})
		this.isSource = true
	}

	start () {

		if (!this.isSetup) {
			console.Log('Tone Player not setup')
			return
		}

		Tone.Transport.stop()

		if (!this.isPart) {
			this.part()
		}

		if (!this.isSource) {
			this.source()
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

Tone.Player = new Player()
