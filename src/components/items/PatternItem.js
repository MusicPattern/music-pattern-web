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
      track: null,
      section: null
    }
  }

  handleToneSequencerTrackSection () {
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
      if (this.state.track) {
        this.state.track.disconnect(toneKey)
        this.setState({ track: null })
      }
      if (this.state.section) {
        this.state.section.disconnect(toneKey)
        this.setState({ section: null })
      }
      return
    }

    const track = Tone.Sequencer.track(scoreInstrument.id)

    if (!track) {
      return
    } else if (!this.state.track) {
      this.setState({ track })
    }

    track.connect(
      toneKey,
      action => {
        if (action === "part") {
          const section = track.section(toneKey, part)
          this.setState({ section })
        }
      }
    )
  }

  componentDidMount () {
    this.handleToneSequencerTrackSection()
  }

  componentDidUpdate (prevProps) {
    const {
      staffVoice
    } = this.props
    if (prevProps.staffVoice !== staffVoice) {
      this.handleToneSequencerTrackSection()
    }
  }

  componentWillUnmount () {
    const {
      toneKey
    } = this.props
    const {
      track,
      section
    } = this.state
    track && track.disconnect(toneKey)
    section && section.disconnect(toneKey)
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
