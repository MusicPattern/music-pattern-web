export const ASSIGN_MUSIC = 'ASSIGN_MUSIC'

const initialState = {}

function music(state = initialState, action) {
  switch (action.type) {
    case ASSIGN_MUSIC:
      return Object.assign({}, state, action.patch)
    default:
      return state
  }
}

export function assignMusic(patch) {
  return {
    type: ASSIGN_MUSIC,
    patch,
  }
}

export default music
