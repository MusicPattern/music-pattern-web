import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.patterns,
  (state, patternId) => patternId,
  (patterns, patternId) =>
    patterns.find(pattern => pattern.id === patternId)
)((state, patternId) => patternId || '')
