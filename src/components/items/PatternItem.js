import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Tone from 'tone'

import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import staffVoiceSelector from '../../selectors/staffVoice'
import partSelector from '../../selectors/part'
import voicePatternSelector from '../../selectors/voicePattern'

class PatternItem extends Component {

  constructor () {
    super()
    this.state = {
      toneInstrument: null,
      tonePart: null
    }
  }

  handleTonePatternInstrumentPart () {
    const {
      part,
      scoreInstrument,
      staffVoice,
      toneKey
    } = this.props
    const {
      isActive
    } = (staffVoice || {})

    if (!isActive) {
      if (this.state.toneInstrument) {
        this.state.toneInstrument.disconnect(toneKey)
        this.setState({ toneInstrument: null })
      }
      if (this.state.tonePart) {
        this.state.tonePart.disconnect(toneKey)
        this.setState({ tonePart: null })
      }
      return
    }

    const toneInstrument = Tone.Pattern.instrument(scoreInstrument.id)

    if (!toneInstrument) {
      return
    } else if (!this.state.toneInstrument) {
      this.setState({ toneInstrument })
    }

    toneInstrument.connect(
      toneKey,
      action => {
        if (action === "part") {
          const tonePart = toneInstrument.part(toneKey, part)
          this.setState({ tonePart })
        }
      }
    )
  }

  componentDidMount () {
    this.handleTonePatternInstrumentPart()
  }

  componentDidUpdate (prevProps) {
    const {
      staffVoice
    } = this.props
    if (prevProps.staffVoice !== staffVoice) {
      this.handleTonePatternInstrumentPart()
    }
  }

  componentWillUnmount () {
    const {
      toneKey
    } = this.props
    const {
      toneInstrument,
      tonePart
    } = this.state
    toneInstrument && toneInstrument.disconnect(toneKey)
    tonePart && tonePart.disconnect(toneKey)
  }

  render () {
    const {
      pattern,
      voicePattern
    } = this.props
    const {
      name
    } = (pattern || {})
    const {
      rootPitch,
      rootTime
    } = (voicePattern || {})
    return (
      <div className='box'>
        Pattern: {name} {rootPitch} {rootTime}
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

      const staffVoice = staffVoiceSelector(state, staffId, voiceId)
      const { positionIndex } = (staffVoice || {})
      const part = partSelector(state, scoreId, staffId, voiceId, id)

      const toneKey = `${staffId || ''}/${voiceId || ''}${id || ''}`

      return {
        part,
        scoreInstrument: scoreInstrumentSelector(state, scoreId, null, positionIndex),
        staffVoice,
        toneKey,
        voicePattern: voicePatternSelector(state, voiceId, id)
      }
    }
  )
)(PatternItem)
