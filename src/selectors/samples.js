import createCachedSelector from "re-reselect"

export default createCachedSelector(
  state => state.data.samples,
  (state, sounds) => sounds,
  (samples, sounds) =>
    sounds.map(sound => sound.sampleId &&
      samples.find(sample => sample.id === sound.sampleId))
)((state, sounds) => sounds ? sounds.map(sound => sound.id).join('-') : ' ')
