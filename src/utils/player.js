import Tone from 'tone'

import Instrument from './instrument'

export default class Player {
	constructor(player = {}) {
		this.band = {}
    this.isReady =  false
	}

	addInstrument(key, instrument) {
		if (!this.band[key]) {
			const newInstrument = new Instrument(instrument)
			this.band[key] = newInstrument
		}
	}

	check () {
		for (let instrument of Object.values(this.band)) {
			instrument.check()
			if (!instrument.isReady) {
				return
			}
			instrument.setup()
		}
		this.isReady = true
	}

	start () {
		Tone.Transport.start()
	}

}
