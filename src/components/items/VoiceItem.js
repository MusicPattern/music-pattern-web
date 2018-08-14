import get from 'lodash.get'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import barVoiceSelector from '../../selectors/barVoice'
import instrumentSelector from '../../selectors/instrument'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import melodySelector from '../../selectors/melody'
import rhythmSelector from '../../selectors/rhythm'
import samplesSelector from '../../selectors/samples'
import soundsSelector from '../../selectors/sounds'

const VoiceItem = ({
  instrument,
  melody,
  rhythm,
  voice
}) => {
  const {
    name
  } = (voice || {})

  console.log('instrument', instrument)

  return (
    <div className='box'>
      {name}
      {melody.pattern}
      {rhythm.pattern}
    </div>
  )
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const { bar, match, voice } = ownProps
      const { scoreId } = match.params
      const { id, melodyId, rhythmId } = voice
      const { positionIndex } = (barVoiceSelector(state, get(bar, 'id'), id) || {})
      const { instrumentId } = (scoreInstrumentSelector(state, scoreId, positionIndex) || {})
      const instrument = instrumentSelector(state, instrumentId)
      const sounds = soundsSelector(state, instrumentId)
      const samples = samplesSelector(state, sounds)
      return {
        instrument,
        melody: melodySelector(state, melodyId),
        rhythm: rhythmSelector(state, rhythmId),
        samples,
        sounds
      }
    }
  )
)(VoiceItem)
