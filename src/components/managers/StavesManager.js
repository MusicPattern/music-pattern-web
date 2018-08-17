import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import StaffItem from '../items/StaffItem'
import stavesSelector from '../../selectors/staves'


class ScorePage extends Component {
  render () {
    const {
      staves
    } = this.props
    return (
      <div>
        {staves.map(staff =>
          <StaffItem key={staff.id} staff={staff} />)}
      </div>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const { scoreId } = ownProps.match.params
      return {
        staves: stavesSelector(state, scoreId),
      }
    }
  )
)(ScorePage)
