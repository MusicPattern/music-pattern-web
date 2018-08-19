import createCachedSelector from "re-reselect"

import melodySelector from './melody'
import rhythmSelector from './rhythm'
import scoreStaffSelector from './scoreStaff'
import staffSelector from './staff'
import staffVoiceSelector from './staffVoice'
import voicePatternSelector from './voicePattern'

export default createCachedSelector(
  scoreStaffSelector,
  (state, scoreId, staffId) => staffSelector(state, staffId),
  (state, scoreId, staffId, voiceId, patternId) =>
    staffVoiceSelector(state, staffId, voiceId),
  (state, scoreId, staffId, voiceId, patternId) =>
    voicePatternSelector(state, voiceId, patternId),
  (state, scoreId, staffId, voiceId, patternId) =>
    melodySelector(state, patternId),
  (state, scoreId, staffId, voiceId, patternId) =>
    rhythmSelector(state, patternId),
  (state, scoreId, staffId, voiceId, patternId) =>
    `${staffId || ''}/${voiceId || ''}/${patternId || ''}`,
  (scoreStaff, staff, staffVoice, voicePattern, rhythm, melody, key) => {

    const { rootPitch } = (staff || {})

    //console.log('scoreStaff', scoreStaff)
    //console.log('staffVoice', staffVoice)
    console.log('voicePattern', voicePattern)
    console.log('rhythm', rhythm)
    console.log('melody', melody)

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
    durations = durations.map(duration => parseInt(duration, 10))
    intervals = intervals.map(interval => parseInt(interval, 10))
    console.log('durations', durations, 'intervals', intervals)

    const pitches = Array(durations.length).fill(0)
    intervals.forEach((interval, index) =>
      pitches[index] = index === 0
        ? rootPitch || 0
        : pitches[index - 1] + interval
    )

    const events = durations.map((duration, index) => ({
      duration,
      pitch: pitches[index]
    }))

    return {
      events,
      key
    }
  }
)((state, scoreId, staffId, voiceId, patternId) =>
  `${scoreId || ''}/${staffId || ''}/${voiceId || ''}/${patternId || ''}`)
