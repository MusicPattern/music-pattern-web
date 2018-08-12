import createCachedSelector from "re-reselect"

import barSelector from './bar'

export default createCachedSelector(
  state => state.data.voices,
  barSelector,
  (voices, bar) => voices.filter(voice =>
    bar.barVoicesIds.includes(voice.id))
)((state, barId) => barId || '')
