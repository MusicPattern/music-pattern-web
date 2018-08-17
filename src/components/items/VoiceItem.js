import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import barVoiceSelector from '../../selectors/barVoice'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import melodySelector from '../../selectors/melody'
import rhythmSelector from '../../selectors/rhythm'
import scoreStaffSelector from '../../selectors/scoreStaff'
import staffBarSelector from '../../selectors/staffBar'

class VoiceItem extends Component {

  handleInstrumentPart = () => {
    const {
      instrument,
      melody,
      rhythm,
      staffBar,
      scoreStaff,
      time
    } = this.props
    if (instrument &&
      typeof time !== 'undefined' &&
      rhythm &&
      melody
    ) {
      console.log('scoreStaff', scoreStaff, 'staffBar', staffBar)
      instrument.part(0, rhythm, melody)
    }
  }

  componentDidMount () {
    this.handleInstrumentPart()
  }

  componentDidUpdate (prevProps) {
    const {
      instrument,
      melody,
      rhythm,
      time
    } = this.props
    if (
      prevProps.instrument !== instrument ||
      prevProps.time !== time ||
      prevProps.rhythm !== rhythm ||
      prevProps.melody !== melody
    ) {
      this.handleInstrumentPart()
    }
  }

  render () {
    const {
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

VoiceItem.defaultProps = {
  time: 0
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {

      const { bar, match, staff, voice } = ownProps
      const { scoreId } = match.params
      const { id, melodyId, rhythmId } = voice

      const scoreStaff = scoreStaffSelector(state, scoreId, get(staff, 'id'))
      const { positionIndex } = (barVoiceSelector(state, get(bar, 'id'), id) || {})
      const scoreInstrument = scoreInstrumentSelector(state, scoreId, null, positionIndex)

      const staffBar = staffBarSelector(state, get(staff, 'id'), get(bar, 'id'))

      let instrument
      const player = state.music.player
      if (scoreInstrument && player) {
        instrument = player.instrument(scoreInstrument.id)
      }

      return {
        instrument,
        melody: melodySelector(state, melodyId),
        player,
        rhythm: rhythmSelector(state, rhythmId),
        scoreStaff,
        staffBar
      }
    }
  )
)(VoiceItem)
