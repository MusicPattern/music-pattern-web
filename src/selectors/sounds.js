import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.sounds,
  (state, instrumentId) => instrumentId,
  (sounds, instrumentId) => sounds.filter(sound =>
    sound.instrumentId === instrumentId)
)((state, instrumentId) => instrumentId || '')
