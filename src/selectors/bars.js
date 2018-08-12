import createCachedSelector from "re-reselect"

import staffSelector from './staff'

export default createCachedSelector(
  state => state.data.bars,
  staffSelector,
  (bars, staff) => bars.filter(bar =>
    staff.staffBarsIds.includes(bar.id))
)((state, staffId) => staffId || '')
