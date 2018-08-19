import Tone from 'tone'

import Instrument from './instrument'

export default class Player {
	constructor() {
		this.band = {}
		this.view = {}
    this.isSetup =  false
	}

	connect ($element, callback) {
		this.view[$element.key] = {
			callback,
			$element
		}
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
			Object.values(this.view).forEach(({ callback }) => callback("setup"))
		}
	}
}

Tone.Player = new Player()
