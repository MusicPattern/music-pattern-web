import { createSelector } from "reselect"

import scoreInstrumentsSelector from './scoreInstruments'

export default createSelector(
  state => state.data.instruments,
  scoreInstrumentsSelector,
  (instruments, scoreInstruments) => instruments.filter(instrument =>
    scoreInstruments.find(scoreInstrument =>
      scoreInstrument.instrumentId === instrument.id))
)
