import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import barVoiceSelector from '../../selectors/barVoice'
import instrumentSelector from '../../selectors/instrument'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import melodySelector from '../../selectors/melody'
import rhythmSelector from '../../selectors/rhythm'

class VoiceItem extends Component {
  render () {
    const {
      instrument,
      melody,
      rhythm,
      voice
    } = this.props
    const {
      name
    } = (voice || {})
    return (
      <div className='box'>
        {name}
        {melody.pattern}
        {rhythm.pattern}
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const { bar, match, voice } = ownProps
      const { scoreId } = match.params
      const { id, melodyId, rhythmId } = voice
      const { positionIndex } = (barVoiceSelector(state, get(bar, 'id'), id) || {})
      const { instrumentId } = (scoreInstrumentSelector(state, scoreId, null, positionIndex) || {})
      const instrument = instrumentSelector(state, instrumentId)
      return {
        instrument,
        melody: melodySelector(state, melodyId),
        rhythm: rhythmSelector(state, rhythmId),
      }
    }
  )
)(VoiceItem)
