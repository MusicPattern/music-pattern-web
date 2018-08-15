import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import scoreSelector from '../../selectors/score'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import soundsSelector from '../../selectors/sounds'

class InstrumentItem extends Component {
  handleAddInstrument () {
    const {
      score,
      scoreInstrument,
      instrument,
      sounds
    } = this.props
    const { player } = (score || {})
    if (!player) {
      return
    }
    player.addInstrument(scoreInstrument.id, { sounds, ...instrument })
    player.check()
    console.log('player IS READYE', player)
  }

  componentDidMount () {
    if (this.props.sounds.length) {
      this.handleAddInstrument()
    }
  }

  componentDidUpdate (prevProps) {
    const {
      sounds
    } = this.props
    if (sounds.length && prevProps.sounds !== sounds) {
      this.handleAddInstrument()
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
