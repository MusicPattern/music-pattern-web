import get from 'lodash.get'
import { requestData } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import PatternItem from './PatternItem'
import patternsSelector from '../../selectors/patterns'
import staffVoiceSelector from '../../selectors/staffVoice'
import { staffVoiceNormalizer } from '../../utils/normalizers'

class VoiceItem extends Component {

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

      const { voice, staff } = ownProps
      const staffId = get(staff, 'id')
      const voiceId = get(voice, 'id')
      const staffVoice = staffVoiceSelector(state, staffId, voiceId)
      const patterns = patternsSelector(state, voiceId)

      return {
        patterns,
        staffVoice
      }
    }
  )
)(VoiceItem)
