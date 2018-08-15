import { call, select, takeEvery } from 'redux-saga/effects'

import { context } from '../utils/audio'
import { AUDIOS_URL } from '../utils/config'

function* fromWatchSuccessDataActions(action) {
  const samples = yield select(state => state.data.samples)
  yield samples.map(function* (sample) {
    if (!sample.decodedAudioData) {
      const response = yield call(fetch, `${AUDIOS_URL}/samples/${sample.id}`)
      const decode = () => new Promise(resolve => {
        response.arrayBuffer().then(arrayBuffer => {
          context.decodeAudioData(arrayBuffer, resolve)
        })
      })
      sample.decodedAudioData = yield call(decode)
    }
  })
}

export function* watchSamplesDataActions(config = {}) {
  yield takeEvery(
    ({ type }) => /SUCCESS_DATA_(.*)/.test(type),
    fromWatchSuccessDataActions
  )
}
