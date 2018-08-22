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

  componentDidMount () {
    const {
      part,
      pattern,
      scoreInstrument,
      staff,
      voice,
    } = this.props
    Tone.Player.connect(
      `${get(staff, 'id')}${get(voice, 'id')}${pattern.id}`,
      action => {
        if (action === "part") {
          const instrument = Tone.Player.instrument(scoreInstrument.id)
          if (!instrument) {
            console.warn(`instrument not found for scoreInstrument ${scoreInstrument.id}`)
            return
          }
          Tone.Player.instrument(scoreInstrument.id).part(part.key, part)
        }
      }
    )
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
