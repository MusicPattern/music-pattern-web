import {
  watchDataActions,
  watchErrorsActions,
  watchModalActions,
  watchUserActions
} from 'pass-culture-shared'
import { all } from 'redux-saga/effects'

import { watchSamplesDataActions } from './samples'
import { API_URL } from '../utils/config'

function* rootSaga() {
  yield all([
    watchDataActions({ url: API_URL }),
    watchErrorsActions(),
    watchModalActions(),
    watchSamplesDataActions(),
    watchUserActions()
  ])
}

export default rootSaga
