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
    rhythmSelector(state, patternId),
  (state, scoreId, staffId, voiceId, patternId) =>
    melodySelector(state, patternId),
  (scoreStaff, staff, staffVoice, voicePattern, rhythm, melody, key) => {
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

    const events = durations.map((duration, index) => ({
      duration,
      interval: intervals[index],
      probability: 0.5
    }))

    const indexes = [
      (scoreStaff || {}).positionIndex,
      (voicePattern || {}).positionIndex
    ]

    return {
      indexes,
      events,
      key: indexes.join('/')
    }
  }
)((state, scoreId, staffId, voiceId, patternId) =>
  `${scoreId || ''}/${staffId || ''}/${voiceId || ''}/${patternId || ''}`)
