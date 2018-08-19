import createCachedSelector from "re-reselect"

import voicePatternsSelector from './voicePatterns'

export default createCachedSelector(
  voicePatternsSelector,
  (state, voiceId, patternId, positionIndex) => voiceId,
  (state, voiceId, patternId, positionIndex) => patternId,
  (state, voiceId, patternId, positionIndex) => positionIndex,
  (voicePatterns, voiceId, patternId, positionIndex) => {
    let filteredVoicePatterns = voicePatterns
    if (patternId) {
      filteredVoicePatterns = filteredVoicePatterns.find(voicePattern =>
        voicePattern.patternId === patternId)
    }
    if (positionIndex) {
      filteredVoicePatterns = filteredVoicePatterns.find(voicePattern =>
        voicePattern.positionIndex === positionIndex)
    }
    return filteredVoicePatterns
  }
)((state, voiceId, patternId, positionIndex) =>
  `${patternId || ''}/${voiceId || ' '}/${positionIndex || ' '}`)
