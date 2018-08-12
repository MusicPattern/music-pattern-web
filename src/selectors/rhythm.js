import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.rhythms,
  (state, rhythmId) => rhythmId,
  (rhythms, rhythmId) => rhythms.find(rhythm => rhythm.id === rhythmId)
)((state, rhythmId) => rhythmId || '')
