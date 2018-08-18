import createCachedSelector from "re-reselect"

import staffVoicesSelector from './staffVoices'

export default createCachedSelector(
  state => state.data.voices,
  staffVoicesSelector,
  (voices, staffVoices) => voices.filter(voice =>
    staffVoices.find(staffVoice => staffVoice.voiceId === voice.id))
)((state, voiceId) => voiceId || '')
