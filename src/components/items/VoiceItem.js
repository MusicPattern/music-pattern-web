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
      isAttacking: false,
      toneInstrument: null
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
      toneInstrument
    } = this.state
    toneInstrument.mute(!toneInstrument.isMuted)
  }

  handleTonePatternInstrument () {
    const {
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
    this.handleTonePatternInstrument()
  }

  componentDidUpdate (prevProps) {
    const {
      staffVoice
    } = this.props
    if (prevProps.staffVoice !== staffVoice) {
      this.handleTonePatternInstrument()
    }
  }

  componentWillUnmount () {
    const {
      toneKey
    } = this.props
    const {
      toneInstrument
    } = this.state

    this.attackTimeout && clearTimeout(this.attackTimeout)
    Tone.Pattern.disconnect(toneKey)
    toneInstrument && toneInstrument.disconnect(toneKey)
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
      isAttacking,
      toneInstrument
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
          toneInstrument && (
            <button className="button is-secondary" onClick={this.onMuteClick}>
              {
                toneInstrument.isMuted
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
