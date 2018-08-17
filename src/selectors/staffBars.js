import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.staffBars,
  (state, staffId) => staffId,
  (staffBars, staffId) => staffBars.filter(staffStave =>
    staffStave.staffId === staffId)
)((state, staffId) => staffId || '')
