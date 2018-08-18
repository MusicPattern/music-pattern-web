import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.staffVoices,
  (state, staffId) => staffId,
  (staffVoices, staffId) => staffVoices.filter(staffVoice =>
    staffVoice.staffId === staffId)
)((state, staffId) => staffId || '')
