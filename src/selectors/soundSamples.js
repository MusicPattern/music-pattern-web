import createCachedSelector from "re-reselect"

import samplesSelector from './samples'

export default createCachedSelector(
  samplesSelector,
  (state, sounds) => sounds,
  (samples, sounds) => sounds.map(sound => sound.sampleId &&
      samples.find(sample => sample.id === sound.sampleId))
)((state, sounds) => sounds ? sounds.map(sound => sound.id).join('-') : ' ')
