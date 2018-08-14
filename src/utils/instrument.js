export default class Instrument {
  constructor (context, buffer) {
    this.context = context
    this.buffer = buffer
  }

  setup () {
  	this.source = this.context.createBufferSource()
  	this.source.buffer = this.buffer
  	this.source.connect(this.context.destination)
  }

  trigger (time) {
	   this.setup()
	   this.source.start(time)
  }
}
