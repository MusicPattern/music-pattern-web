import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Tone from 'tone'

import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import staffVoiceSelector from '../../selectors/staffVoice'
import partSelector from '../../selectors/part'

class PatternItem extends Component {

  handleInstrumentPart = () => {
    const {
      part,
      scoreInstrument
    } = this.props
    const {
      id
    } = (scoreInstrument || {})
    const instrument = Tone.Player.instrument(id)
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
      part,
      scoreInstrument
    } = this.props
    if (
      prevProps.part !== part ||
      prevProps.scoreInstrument !== scoreInstrument
    ) {
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

      const { positionIndex } = (staffVoiceSelector(state, staffId, voiceId) || {})
      const part = partSelector(state, scoreId, staffId, voiceId, id)

      return {
        part,
        scoreInstrument: scoreInstrumentSelector(state, scoreId, null, positionIndex)
      }
    }
  )
)(PatternItem)
