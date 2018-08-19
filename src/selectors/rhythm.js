import createCachedSelector from "re-reselect"

import patternSelector from './pattern'

export default createCachedSelector(
  state => state.data.rhythms,
  patternSelector,
  (state, patternId, rhythmId) => rhythmId,
  (rhythms, pattern, rhythmId) =>
    rhythms.find(rhythm =>
      rhythm.id === (pattern ? pattern.rhythmId : rhythmId))
)((state, patternId, rhythmId) => `${patternId || ''}/${rhythmId || ''}`)
