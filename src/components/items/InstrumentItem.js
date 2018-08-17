import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import scoreSelector from '../../selectors/score'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import soundsSelector from '../../selectors/sounds'

class InstrumentItem extends Component {
  handlePlayerInstrument () {
    const {
      scoreInstrument,
      instrument,
      player,
      sounds
    } = this.props
    if (!player) {
      return
    }

    console.log('SOUNDS', sounds)

    this.instrument = player.instrument(scoreInstrument.id, { sounds, ...instrument })
  }

  componentDidMount () {
    if (this.props.sounds.length) {
      this.handlePlayerInstrument()
    }
  }

  componentDidUpdate (prevProps) {
    const {
      sounds
    } = this.props
    if (sounds.length && prevProps.sounds !== sounds) {
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
      const player = state.music.player
      return {
        player,
        score: scoreSelector(state, scoreId),
        scoreInstrument: scoreInstrumentSelector(state, scoreId, instrument.id),
        sounds
      }
    }
  )
)(InstrumentItem)
