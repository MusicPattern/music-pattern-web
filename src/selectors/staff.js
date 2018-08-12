import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.staves,
  (state, staffId) => staffId,
  (staves, staffId) => staves.find(staff => staff.id === staffId)
)((state, staffId) => staffId || '')
