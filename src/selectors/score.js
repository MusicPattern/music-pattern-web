import createCachedSelector from "re-reselect"

import Player from '../utils/player'

export default createCachedSelector(
  state => state.data.scores,
  (state, scoreId) => scoreId,
  (scores, scoreId) => {
    const score = scores.find(score => score.id === scoreId)
    if (!score) {
      return
    }
    const player = new Player()
    return Object.assign({ player }, score)
  }
)((state, scoreId) => scoreId || '')
