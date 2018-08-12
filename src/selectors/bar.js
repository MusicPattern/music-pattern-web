import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.bars,
  (state, barId) => barId,
  (bars, barId) => bars.find(bar => bar.id === barId)
)((state, barId) => barId || '')
