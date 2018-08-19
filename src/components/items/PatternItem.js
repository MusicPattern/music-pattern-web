import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import staffVoiceSelector from '../../selectors/staffVoice'
import partSelector from '../../selectors/part'

class PatternItem extends Component {

  handleInstrumentPart = () => {
    const {
      instrument,
      part
    } = this.props
    if (!instrument) {
      return
    }
    instrument.part(part.key, part)
  }

  componentDidMount () {
    this.handleInstrumentPart()
  }

  componentDidUpdate (prevProps) {
    const {
      instrument
    } = this.props
    if (prevProps.instrument !== instrument) {
      this.handleInstrumentPart()
    }
  }

  render () {
    const {
      pattern
    } = this.props
    const {
      name
    } = (pattern || {})

    return (
      <div className='box'>
        Pattern: {name}
      </div>
    )
  }
}


export default compose(
  withRouter,
  connect(
    (state, ownProps) => {

      const { match, staff, pattern, voice } = ownProps
      const { scoreId } = match.params
      const staffId = get(staff, 'id')
      const voiceId = get(voice, 'id')
      const { id } = pattern

      let instrument
      const { positionIndex } = (staffVoiceSelector(state, staffId, voiceId) || {})
      const scoreInstrument = scoreInstrumentSelector(state, scoreId, null, positionIndex)
      const player = state.music.player
      if (scoreInstrument && player) {
        instrument = player.instrument(scoreInstrument.id)
      }

      const part = partSelector(state, scoreId, staffId, voiceId, id)

      return {
        instrument,
        part
      }
    }
  )
)(PatternItem)
