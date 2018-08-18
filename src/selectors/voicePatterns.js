import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.voicePatterns,
  (state, voiceId) => voiceId,
  (voicePatterns, voiceId) => voicePatterns.filter(voicePattern =>
    voicePattern.voiceId === voiceId)
)((state, voiceId) => voiceId || '')
