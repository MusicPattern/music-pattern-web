import createCachedSelector from "re-reselect"

import scoreInstrumentsSelector from './scoreInstruments'

export default createCachedSelector(
  scoreInstrumentsSelector,
  (state, scoreId, instrumentId, positionIndex) => instrumentId,
  (state, scoreId, instrumentId, positionIndex) => positionIndex,
  (scoreInstruments, instrumentId, positionIndex) => {
    if (instrumentId) {
      return scoreInstruments.find(scoreInstrument =>
        scoreInstrument.instrumentId === instrumentId)
    }
    return scoreInstruments.find(scoreInstrument =>
      scoreInstrument.positionIndex === positionIndex)
  }
)((state, scoreId, instrumentId, positionIndex) => `${scoreId || ' '}/${instrumentId || ' '}/${positionIndex || ' '}`)
