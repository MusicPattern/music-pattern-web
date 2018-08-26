import Tone from 'tone'

import Dispatcher from './dispatcher'
import Instrument from './instrument'

export default class Pattern extends Dispatcher {
	constructor() {
		super()
		this.band = {}
		this.isPart = false
    this.isInstrumentsSetup = false
	}

	instrument(key, instrument) {
		if (this.band[key]) {
			return this.band[key]
		}
		if (instrument) {
			const newInstrument = new Instrument(instrument, { pattern: this })
			newInstrument.setup()
			this.band[key] = newInstrument
			return newInstrument
		}
	}

	handleInstrumentSetupSuccess () {
		if (Object.values(this.band).every(instrument => instrument.isInstrumentsSetup)) {
			this.isInstrumentsSetup = true
			this.dispatch("instruments-setup")
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

		if (!this.isInstrumentsSetup) {
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
