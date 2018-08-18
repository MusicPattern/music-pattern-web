import get from 'lodash.get'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import PatternItem from './PatternItem'
import patternsSelector from '../../selectors/patterns'

class VoiceItem extends Component {

  render () {
    const {
      patterns,
      staff,
      voice
    } = this.props
    const {
      name
    } = (voice || {})
    return (
      <div className='box'>
        {name}
        {patterns.map(pattern =>
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

      const { staff } = ownProps
      const staffId = get(staff, 'id')

      const patterns = patternsSelector(state, staffId)

      return {
        patterns
      }
    }
  )
)(VoiceItem)
