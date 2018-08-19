export const ASSIGN_TONE = 'ASSIGN_TONE'

const initialState = {}

function tone(state = initialState, action) {
  switch (action.type) {
    case ASSIGN_TONE:
      return Object.assign({}, state, action.patch)
    default:
      return state
  }
}

export function assignTone(patch) {
  return {
    type: ASSIGN_TONE,
    patch,
  }
}

export default tone
