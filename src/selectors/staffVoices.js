import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.staffVoices,
  (state, staffId) => staffId,
  (staffVoices, staffId) => {
    let filteredStaffVoices = staffVoices.filter(staffVoice =>
      staffVoice.staffId === staffId)

    filteredStaffVoices.sort((sv1,sv2) => sv1.positionIndex - sv2.positionIndex)

    return filteredStaffVoices
  }
)((state, staffId) => staffId || '')
