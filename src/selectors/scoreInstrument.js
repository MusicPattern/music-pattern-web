import createCachedSelector from "re-reselect"

import scoreInstrumentsSelector from './scoreInstruments'

export default createCachedSelector(
  scoreInstrumentsSelector,
  (state, scoreId, positionIndex) => positionIndex,
  (scoreInstruments, positionIndex) => scoreInstruments.find(scoreInstrument =>
    scoreInstrument.positionIndex === positionIndex)
)((state, scoreId, positionIndex) => `${scoreId || ''}/${positionIndex || ''}`)
