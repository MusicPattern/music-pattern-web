import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.voices,
  (state, voiceId) => voiceId,
  (voices, voiceId) => voices.find(voice => voice.id === voiceId)
)((state, voiceId) => voiceId || '')
