import Tone from 'tone'

//pass in some initial values for the filter and filter envelope
var synth = new Tone.Synth({
	"oscillator" : {
		"type" : "pwm",
		"modulationFrequency" : 0.2
	},
	"envelope" : {
		"attack" : 0.02,
		"decay" : 0.1,
		"sustain" : 0.2,
		"release" : 0.9,
	}
}).toMaster();

// synth.triggerAttackRelease("C3", "1n");

//start the note "D3" one second from now
//synth.triggerAttack("D3", "+1");

/*
const melodyNotes = ["C3", "D3", "E3"]
const rhythmDurations = ["2n", "2n", "2n"]
//rhythmDurations.reverse()

rhythmDurations.forEach((rhythmDuration, index) => {
  console.log('rhythmDuration', rhythmDuration)
  Tone.Transport.schedule(
    time => {
      console.log('time', time)
      synth.triggerAttack(melodyNotes[index], time)
    },
    rhythmDuration
  )
})
*/

/*
const part = new Tone.Part(function(time, pitch){
	synth.triggerAttackRelease(pitch, "8n", time);
}, [["0", "C#3"], ["4n", "G3"], ["3 * 8n", "G#3"], ["2n", "C3"]]);

part.start(0);
*/

//create a looped note event every half-note

/*
var note = new Tone.Event(function(time, pitch){
  console.log(time, pitch)
	synth.triggerAttackRelease(pitch, "4n", time);
}, "C3");
*/

//set the note to loop every half measure
/*
note.set({
	"loop" : true,
	"loopEnd" : "2n"
});
*/

//start the note at the beginning of the Transport timeline
/*
note.start(0);


var note2 = new Tone.Event(function(time, pitch){
  console.log(time, pitch)
	synth.triggerAttackRelease(pitch, "4n", time);
}, "D3");

note2.start(0);

//stop the note on the 4th measure
// note.stop("4m");

Tone.Transport.start()

/*
export default class Player () {
    constructor () {

    }

    Tone.Transport.setInterval(function(time){ hihat.trigger(time) }, '8t');
}
*/
