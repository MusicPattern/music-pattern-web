import { createSelector } from "reselect"

import { AUDIOS_URL } from '../utils/config'

export default createSelector(
  state => state.data.samples,
  samples => samples.map(sample => {
    return Object.assign({
      url: `${AUDIOS_URL}/samples/${sample.id}`
    }, sample)
  })
)
