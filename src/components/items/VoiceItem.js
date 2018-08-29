import classnames from 'classnames'
import get from 'lodash.get'
import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Tone from 'tone'

import PatternItem from './PatternItem'
import patternsSelector from '../../selectors/patterns'
import scoreInstrumentSelector from '../../selectors/scoreInstrument'
import staffVoiceSelector from '../../selectors/staffVoice'
import { staffVoiceNormalizer } from '../../utils/normalizers'

class VoiceItem extends Component {

  constructor() {
    super()
    this.state = {
      isAdding: true,
      isAttacking: false,
      track: null
    }
  }

  onActivateClick = () => {
    const { dispatch, staffVoice } = this.props
    const {
      id,
      isActive
    } = (staffVoice || {})
    dispatch(requestData("PATCH", `staffVoices/${id}`, {
      body: { isActive: !isActive },
      normalizer: staffVoiceNormalizer
    }))
  }

  onMuteClick = () => {
    const {
      track
    } = this.state
    track.mute(!track.isMuted)
  }

  handleToneSequencerTrack () {
    const {
      scoreInstrument,
      staffVoice,
      toneKey
    } = this.props
    const {
      isActive
    } = (staffVoice || {})

    if (!isActive) {
      if (this.state.track) {
        if (get(this.state, 'track.toneInstrument._volume')) {
          this.state.track.toneInstrument.dispose()
        }
        this.state.track.disconnect(toneKey)
        this.setState({ track: null })
      }
      return
    }

    const track = Tone.Sequencer.track(scoreInstrument.id)

    if (!track) {
      return
    } else if (!this.state.track) {
      this.setState({ track })
    }

    if (!track.isTracksSetup) {
      track.dispatch("part")
    }

    track.connect(
      toneKey,
      action => {
        if (action === "attack" || action === "release") {
          this.setState({ isAttacking: true }, () => {
            this.attackTimeout = setTimeout(() => {
              this.attackTimeout && this.setState({ isAttacking: false })
            }, 100)
          })
          return
        }
        if (action === "mute") {
          this.forceUpdate()
        }
      }
    )
  }

  componentDidMount () {
    this.handleToneSequencerTrack()
  }

  componentDidUpdate (prevProps) {
    const {
      staffVoice
    } = this.props
    if (
      prevProps.staffVoice !== staffVoice
    ) {
      console.log('OUAI NON', staffVoice)
      this.handleToneSequencerTrack()
    }
  }

  componentWillUnmount () {
    const {
      toneKey
    } = this.props
    const {
      track
    } = this.state

    this.attackTimeout && clearTimeout(this.attackTimeout)
    Tone.Sequencer.disconnect(toneKey)
    track && track.disconnect(toneKey)
  }

  render () {
    const {
      patterns,
      staff,
      staffVoice,
      voice
    } = this.props
    const {
      name
    } = (voice || {})
    const {
      isActive,
      positionIndex
    } = (staffVoice || {})
    const {
      isAdding,
      isAttacking,
      track
    } = this.state

    return (
      <div className="box">
        {positionIndex}
        <button className="button is-secondary" onClick={this.onActivateClick}>
          {
            isActive
              ? "Inactivate"
              : "Activate"
          }
        </button>
        {
          track && (
            <button className="button is-secondary" onClick={this.onMuteClick}>
              {
                track.isMuted
                  ? "Unmute"
                  : "Mute"
              }
            </button>
          )
        }
        <button
          className={classnames(
            "button is-primary",
            { "is-invisible": !isAttacking })}
        >
          Attack
        </button>
        Voice: {name}
        {isAdding && <PatternItem
          staff={staff}
          voice={voice} />}
        {isActive && patterns.map(pattern =>
          <PatternItem key={pattern.id}
            pattern={pattern}
            staff={staff}
            voice={voice} />)}
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {

      const { match, staff, voice } = ownProps
      const { scoreId } = match.params
      const staffId = get(staff, 'id')
      const voiceId = get(voice, 'id')
      const staffVoice = staffVoiceSelector(state, staffId, voiceId)
      const { positionIndex } = (staffVoice || {})
      const patterns = patternsSelector(state, voiceId)
      const scoreInstrument = scoreInstrumentSelector(state, scoreId, null, positionIndex)

      const toneKey = `${staffId || ''}/${voiceId || ''}`

      return {
        patterns,
        scoreInstrument,
        staffVoice,
        toneKey
      }
    }
  )
)(VoiceItem)
