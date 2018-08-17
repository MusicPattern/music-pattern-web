import createCachedSelector from "re-reselect"

import samplesSelector from './samples'

export default createCachedSelector(
  state => state.data.sounds,
  (state, instrumentId) => instrumentId,
  samplesSelector,
  (sounds, instrumentId, samples) => {
    const filteredSounds = sounds.filter(sound =>
      sound.instrumentId === instrumentId)

    filteredSounds.forEach(sound => {
      if (sound.sampleId) {
        sound.sample = samples.find(sample => sample.id === sound.sampleId)
      }
    })

    return filteredSounds
  }
)((state, instrumentId) => instrumentId || '')
