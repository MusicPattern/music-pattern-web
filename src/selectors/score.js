import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.scores,
  (state, scoreId) => scoreId,
  (scores, scoreId) => scores.find(score => score.id === scoreId)
)((state, scoreId) => scoreId || '')
