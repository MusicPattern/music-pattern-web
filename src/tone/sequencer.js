import Tone from 'tone'

import Dispatcher from './Dispatcher'
import Track from './Track'

export default class Sequencer extends Dispatcher {
	constructor() {
		super()
		this.band = {}
		this.endTimes = []
		this.isPart = false
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
			track.part()
		})

		this.isPart = true

	}

	start () {

		if (!this.isTracksSetup) {
			console.log('Tone Sequencer not setup')
			return
		}

		Tone.Transport.stop()

		/*
		if (!this.isPart) {
			console.log('on repart')
			this.part()
		}
		*/

		const maxEndTime = Math.max(...this.endTimes)
		console.log('this.times', this.endTimes, maxEndTime)
		Tone.Transport.schedule(time => {
			console.log('BEN ALORS')
			this.stop()
		}, maxEndTime)

    Tone.Transport.start()
		this.dispatch("start")
	}

	stop () {
		Tone.Transport.stop()
		this.dispatch("stop")
		this.endTimes = []
	}

}

Tone.Sequencer = new Sequencer()
window.Tone = Tone
