import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.barVoices,
  (state, barId) => barId,
  (state, barId, voiceId) => voiceId,
  (barVoices, barId, voiceId) => barVoices.find(barVoice =>
    barVoice.barId === barId && barVoice.voiceId === voiceId)
)((state, barId, voiceId) => `${barId || ''}/${voiceId || ''}`)
