import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.melodies,
  (state, melodyId) => melodyId,
  (melodies, melodyId) => melodies.find(melody => melody.id === melodyId)
)((state, melodyId) => melodyId || '')
