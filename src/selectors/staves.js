import createCachedSelector from "re-reselect"

import scoreSelector from './score'

export default createCachedSelector(
  state => state.data.staves,
  scoreSelector,
  (staves, score) => staves.filter(staff =>
    score.scoreStavesIds.includes(staff.id))
)((state, scoreId) => scoreId || '')
