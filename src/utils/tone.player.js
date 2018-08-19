import Tone from 'tone'

import Instrument from './instrument'

export default class Player {
	constructor() {
		this.band = {}
		this.subscribers = {}
    this.isSetup =  false
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

	start () {
		Tone.Transport.stop()
    Tone.Transport.cancel()
		Object.values(this.band).forEach(instrument => {
			instrument.cancel()
		})
    Tone.Player.dispatch("part")
    Tone.Transport.start()
	}

}

Tone.Player = new Player()
