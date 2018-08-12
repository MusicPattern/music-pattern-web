import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.staves,
  (state, scoreId) => scoreId,
  (staves, scoreId) => staves.filter(staff => staff.scoreId === scoreId)
)((state, scoreId) => scoreId || '')
