import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.scoreStaves,
  (state, scoreId) => scoreId,
  (scoreStaves, scoreId) => scoreStaves.filter(scoreStave =>
    scoreStave.scoreId === scoreId)
)((state, scoreId) => scoreId || '')
