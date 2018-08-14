import createCachedSelector from "re-reselect"

//import instrumentsSelector from './instruments'

export default createCachedSelector(
  state => state.data.scoreInstruments,
  (state, scoreId) => scoreId,
  //instrumentsSelector,
  //(scoreInstruments, instruments) => scoreInstruments.filter(scoreInstrument =>
  //  instruments.find(instrument => instrument.id === scoreInstrument.instrumentId)
  //)
  (scoreInstruments, scoreId) => scoreInstruments.filter(scoreInstrument =>
    scoreInstrument.scoreId === scoreId)
)((state, scoreId) => scoreId || '')
