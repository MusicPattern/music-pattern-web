import {
  errors,
  form,
  loading,
  modal,
  notification,
  user
} from 'pass-culture-shared'
import { combineReducers } from 'redux'

import data from './data'
import tone from './tone'

const rootReducer = combineReducers({
  data,
  errors,
  form,
  loading,
  modal,
  notification,
  tone,
  user
})

export default rootReducer
