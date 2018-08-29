import get from 'lodash.get'
import createCachedSelector from "re-reselect"

export default createCachedSelector(
  (state, pattern) => pattern,
  (state, pattern, melody) => melody,
  (state, pattern, melody, rhythm) => rhythm,
  (pattern, melody, rhythm) => {
    const intervals = get(melody, "intervals", "")
    const durations = get(rhythm, "durations", "")
    return Object.assign({
      durations,
      intervals
    }, pattern)
  }
)((state, pattern) => get(pattern, "id", ""))
