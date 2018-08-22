import createCachedSelector from "re-reselect"

import staffVoicesSelector from './staffVoices'

export default createCachedSelector(
  state => state.data.voices,
  staffVoicesSelector,
  (voices, staffVoices) =>
    staffVoices.map(staffVoice =>
      voices.find(voice => voice.id === staffVoice.voiceId))
               .filter(staffVoice => staffVoice)
)((state, voiceId) => voiceId || '')
