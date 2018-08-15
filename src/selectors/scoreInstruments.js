import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.scoreInstruments,
  (state, scoreId) => scoreId,
  (scoreInstruments, scoreId) => scoreInstruments.filter(scoreInstrument =>
    scoreInstrument.scoreId === scoreId)
)((state, scoreId) => scoreId || '')
