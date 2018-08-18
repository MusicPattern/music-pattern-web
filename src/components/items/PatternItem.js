import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import melodySelector from '../../selectors/melody'
import rhythmSelector from '../../selectors/rhythm'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import scoreStaffSelector from '../../selectors/scoreStaff'
import voicePatternSelector from '../../selectors/voicePattern'
import staffVoiceSelector from '../../selectors/staffVoice'

class PatternItem extends Component {

  handleInstrumentPart = () => {
    const {
      instrument,
      melody,
      rhythm,
      staffPattern,
      time
    } = this.props
    if (instrument &&
      typeof time !== 'undefined' &&
      rhythm &&
      melody
    ) {
      console.log('staffPattern', staffPattern, 'staffPattern', staffPattern)
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

    console.log('voice', voice)

    return (
      <div className='box'>
        {name}
        {melody.intervals}
        {rhythm.durations}
      </div>
    )
  }
}

PatternItem.defaultProps = {
  time: 0
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {

      const { match, staff, pattern, voice } = ownProps
      const { scoreId } = match.params
      const staffId = get(staff, 'id')
      const voiceId = get(voice, 'id')
      const { id, melodyId, rhythmId } = pattern

      const staffVoice = staffVoiceSelector(state, staffId, voiceId)

      let instrument
      const scoreStaff = scoreStaffSelector(state, scoreId, )
      const { positionIndex } = (staffVoiceSelector(state, staffId, voiceId) || {})
      const scoreInstrument = scoreInstrumentSelector(state, scoreId, null, positionIndex)
      const player = state.music.player
      if (scoreInstrument && player) {
        instrument = player.instrument(scoreInstrument.id)
      }

      const voicePattern = voicePatternSelector(state, voiceId, id)

      return {
        instrument,
        melody: melodySelector(state, melodyId),
        player,
        rhythm: rhythmSelector(state, rhythmId),
        scoreStaff,
        staffVoice,
        voicePattern
      }
    }
  )
)(PatternItem)
