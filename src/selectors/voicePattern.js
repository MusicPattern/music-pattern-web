import createCachedSelector from "re-reselect"

import voicePatternsSelector from './voicePatterns'

export default createCachedSelector(
  voicePatternsSelector,
  (state, staffId, voiceId, positionIndex) => voiceId,
  (state, staffId, voiceId, positionIndex) => positionIndex,
  (voicePatterns, voiceId, positionIndex) => {
    if (voiceId) {
      return voicePatterns.find(voicePattern =>
      voicePattern.voiceId === voiceId)
    }
    return voicePatterns.find(voicePattern =>
      voicePattern.positionIndex === positionIndex)
  }
)((state, staffId, voiceId, positionIndex) =>
  `${staffId || ' '}/${voiceId || ' '}/${positionIndex || ' '}`)
