import createCachedSelector from "re-reselect"

import voicePatternsSelector from './voicePatterns'

export default createCachedSelector(
  state => state.data.patterns,
  voicePatternsSelector,
  (patterns, voicePatterns) => patterns.filter(pattern =>
    voicePatterns.find(voicePattern => voicePattern.patternId === pattern.id))
)((state, voiceId) => voiceId || '')
