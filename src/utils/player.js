import Tone from 'tone'

import { ROOT_PATH } from './config'
import Instrument from './instrument'

var context = new AudioContext;

var sampleLoader = function(url, context, callback) {
	var request = new XMLHttpRequest()
	request.open('get', url, true)
	request.responseType = 'arraybuffer'
	request.onload = function() {
		context.decodeAudioData(
      request.response,
      function(buffer) { callback(buffer) }
    )
	}
	request.send()
}

sampleLoader(`${ROOT_PATH}/songs/Bass-Drum-2.wav`, context, function(buffer) {

  var instrument = new Instrument(context, buffer)

  var synth = new Tone.Synth().toMaster();

  const part = new Tone.Part(function(time, pitch){
    console.log('time', time, 'pitch', pitch)
  	//synth.triggerAttackRelease(pitch, "8n", time);
    instrument.trigger(time)
  }, [
    ["1", "C#3"],
    /*
    {
      value: "C#3",
      time: "1"
    }*/
    ["3", "G3"],
    ["5", "G#3"],
    ["7", "C3"]
  ])

  part._events.forEach(event => {
    //event.probability = 0.5;
  })

  part.start(0)

  Tone.Transport.start()

})
