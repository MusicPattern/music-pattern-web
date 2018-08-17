import createCachedSelector from "re-reselect"

import scoreStavesSelector from './scoreStaves'

export default createCachedSelector(
  scoreStavesSelector,
  (state, scoreId, staffId, positionIndex) => staffId,
  (state, scoreId, staffId, positionIndex) => positionIndex,
  (scoreStaves, staffId, positionIndex) => {
    if (staffId) {
      return scoreStaves.find(scoreInstrument =>
      scoreInstrument.staffId === staffId)
    }
    return scoreStaves.find(scoreInstrument =>
      scoreInstrument.positionIndex === positionIndex)
  }
)((state, scoreId, staffId, positionIndex) =>
  `${scoreId || ' '}/${staffId || ' '}/${positionIndex || ' '}`)
