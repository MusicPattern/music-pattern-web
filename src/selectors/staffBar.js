import createCachedSelector from "re-reselect"

import staffBarsSelector from './staffBars'

export default createCachedSelector(
  staffBarsSelector,
  (state, staffId, barId, positionIndex) => barId,
  (state, staffId, barId, positionIndex) => positionIndex,
  (staffBars, barId, positionIndex) => {
    if (barId) {
      return staffBars.find(staffBar =>
      staffBar.barId === barId)
    }
    return staffBars.find(staffBar =>
      staffBar.positionIndex === positionIndex)
  }
)((state, staffId, barId, positionIndex) =>
  `${staffId || ' '}/${barId || ' '}/${positionIndex || ' '}`)
