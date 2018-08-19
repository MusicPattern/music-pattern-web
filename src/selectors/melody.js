import createCachedSelector from "re-reselect"

import patternSelector from './pattern'

export default createCachedSelector(
  state => state.data.melodies,
  patternSelector,
  (state, patternId, melodyId) => melodyId,
  (melodies, pattern, melodyId) =>
    melodies.find(melody =>
      melody.id === (pattern ? pattern.melodyId : melodyId))
)((state, patternId, melodyId) => `${patternId || ''}/${melodyId || ''}`)
