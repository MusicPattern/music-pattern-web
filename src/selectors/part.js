import createCachedSelector from "re-reselect"

import melodySelector from './melody'
import rhythmSelector from './rhythm'
import scoreStaffSelector from './scoreStaff'
import staffSelector from './staff'
import staffVoiceSelector from './staffVoice'
import voiceSelector from './voice'
import voicePatternSelector from './voicePattern'

export default createCachedSelector(
  scoreStaffSelector,
  (state, scoreId, staffId) => staffSelector(state, staffId),
  (state, scoreId, staffId, voiceId, patternId) =>
    staffVoiceSelector(state, staffId, voiceId),
  (state, scoreId, staffId, voiceId, patternId) =>
    voiceSelector(state, voiceId),
  (state, scoreId, staffId, voiceId, patternId) =>
    voicePatternSelector(state, voiceId, patternId),
  (state, scoreId, staffId, voiceId, patternId) =>
    melodySelector(state, patternId),
  (state, scoreId, staffId, voiceId, patternId) =>
    rhythmSelector(state, patternId),
  (scoreStaff, staff, staffVoice, voice, voicePattern, melody, rhythm) => {

    const {
      rootDuration,
      rootInterval,
    } = voicePattern

    let durations, intervals
    if (!rhythm && melody) {
      intervals = melody.intervals.split(',')
      durations = Array(intervals.length).fill(1)
    } else if (rhythm && !melody) {
      durations = rhythm.durations.split(',')
      intervals = Array(durations.length).fill(0)
    } else {
      intervals = melody.intervals.split(',')
      durations = rhythm.durations.split(',')
    }
    durations = durations.map(duration =>
      parseFloat(
          duration.split('/')
                  .map(fraction => parseInt(fraction, 10))
                  .reduce((a,b) => a/b)
      )
    )
    intervals = intervals.map(interval => parseInt(interval, 10))

    const probabilities = voicePattern.probabilities.split(',')

    const events = durations.map((duration, index) => {
      let interval = intervals[index]
      if (typeof interval === "undefined") {
        console.warn(`interval is not defined for this part here`)
        interval = 0
      }

      let probability = probabilities[index]
      if (typeof probability === "undefined") {
        probability = 1
      }

      return {
        duration,
        interval,
        probability
      }
    })

    const indexes = [
      (scoreStaff || {}).positionIndex,
      (voicePattern || {}).positionIndex
    ]

    return {
      description: voice.name,
      indexes,
      events,
      key: indexes.join('/'),
      rootDuration,
      rootInterval,
    }
  }
)((state, scoreId, staffId, voiceId, patternId) =>
  `${scoreId || ''}/${staffId || ''}/${voiceId || ''}/${patternId || ''}`)
