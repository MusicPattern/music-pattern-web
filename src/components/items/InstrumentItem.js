import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Tone from 'tone'

import scoreSelector from '../../selectors/score'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import soundsSelector from '../../selectors/sounds'

class InstrumentItem extends Component {
  handlePlayerInstrument () {
    const {
      scoreInstrument,
      instrument,
      sounds
    } = this.props
    this.instrument = Tone.Player.instrument(
      scoreInstrument.id,
      { sounds, ...instrument }
    )
  }

  componentDidMount () {
    this.handlePlayerInstrument()
  }

  componentDidUpdate (prevProps) {
    const {
      instrument,
      sounds
    } = this.props
    if (
      prevProps.instrument !== instrument ||
      prevProps.sounds !== sounds
    ) {
      this.handlePlayerInstrument()
    }
  }

  render () {
    const {
      instrument
    } = this.props
    const {
      name
    } = instrument
    return (
      <div>
        {name}
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const { instrument, match } = ownProps
      const { scoreId } = match.params
      const sounds = soundsSelector(state, instrument.id)
      return {
        score: scoreSelector(state, scoreId),
        scoreInstrument: scoreInstrumentSelector(state, scoreId, instrument.id),
        sounds
      }
    }
  )
)(InstrumentItem)
