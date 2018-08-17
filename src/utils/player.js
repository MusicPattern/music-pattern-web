import Tone from 'tone'

import Instrument from './instrument'

export default class Player {
	constructor(player = {}) {
		this.band = {}
		this.handleSetupSuccess = player.handleSetupSuccess
    this.isSetup =  false
	}

	instrument(key, instrument) {
		if (this.band[key]) {
			return this.band[key]
		}
		if (instrument) {
			const newInstrument = new Instrument(instrument)
			newInstrument.player = this
			newInstrument.setup()
			this.band[key] = newInstrument
			return newInstrument
		}
	}

	handleInstrumentSetupSuccess () {
		if (Object.values(this.band).every(instrument => instrument.isSetup)) {
			this.isSetup = true
			this.handleSetupSuccess && this.handleSetupSuccess()
		}
	}

	start () {
		Tone.Transport.start()
	}
}
