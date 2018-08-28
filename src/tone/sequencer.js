import Tone from 'tone'

import Dispatcher from './dispatcher'
import Track from './track'

export default class Sequencer extends Dispatcher {
	constructor() {
		super()
		this.band = {}
		this.isPart = false
		this.isPlaying = false
    this.isTracksSetup = false
	}

	track(key, instrument) {
		if (this.band[key]) {
			return this.band[key]
		}
		if (instrument) {
			const newTrack = new Track(instrument)
			newTrack.setup()
			this.band[key] = newTrack
			return newTrack
		}
	}

	handleTrackSetupSuccess () {
		if (Object.values(this.band).every(track => track.isSetup)) {
			this.isTracksSetup = true
			this.dispatch("tracks-setup")
		}
	}

	loop () {
		Tone.Transport.loop = !Tone.Transport.loop
		this.dispatch("loop")
	}

	part () {
		Tone.Transport.cancel()

		Object.values(this.band).forEach(track => {
			track.cancel()
			track.dispatch('part')
		})

		this.isPart = true

	}

	start () {

		if (!this.isTracksSetup) {
			console.log('Tone Sequencer not setup')
			return
		}

		Tone.Transport.stop()

		console.log('this.isPart', this.isPart)

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

Tone.Sequencer = new Sequencer()
