import createCachedSelector from "re-reselect"

import instrumentsSelector from './instruments'

export default createCachedSelector(
  instrumentsSelector,
  (state, scoreId, instrumentId) => instrumentId,
  (instruments, instrumentId) => instruments.find(instrument =>
    instrument.id === instrumentId)
)((state, instrumentId) => instrumentId || '')
