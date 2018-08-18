import createCachedSelector from "re-reselect"

import staffVoicesSelector from './staffVoices'

export default createCachedSelector(
  staffVoicesSelector,
  (state, staffId, voiceId, positionIndex) => voiceId,
  (state, staffId, voiceId, positionIndex) => positionIndex,
  (staffVoices, voiceId, positionIndex) => {
    if (voiceId) {
      return staffVoices.find(staffVoice =>
      staffVoice.voiceId === voiceId)
    }
    return staffVoices.find(staffVoice =>
      staffVoice.positionIndex === positionIndex)
  }
)((state, staffId, voiceId, positionIndex) =>
  `${staffId || ' '}/${voiceId || ' '}/${positionIndex || ' '}`)
