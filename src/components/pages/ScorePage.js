import {
  requestData
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import StaffItem from '../items/StaffItem'
import Main from '../layout/Main'
import { scoreNormalizer } from '../../utils/normalizers'
import scoreSelector from '../../selectors/score'
import stavesSelector from '../../selectors/staves'

class ScorePage extends Component {
  handleDataRequest = (handleSuccess, handleFail) => {
    const {
      dispatch,
      match: { params: { scoreId } },
      score
    } = this.props
    !score && scoreId !== 'new' && dispatch(requestData(
      'GET',
      `scores/${scoreId}`, {
        handleSuccess,
        handleFail,
        normalizer: scoreNormalizer
      }))
  }

  render () {
    const {
      score,
      staves
    } = this.props
    const {
      name
    } = (score || {})
    return (
      <Main
        fullscreen
        handleDataRequest={this.handleDataRequest}
        name='score'>
        <section className='section'>
          {name}
          {staves.map(staff => <StaffItem key={staff.id} staff={staff} />)}
        </section>
      </Main>
    )
  }
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => {
      const { scoreId } = ownProps.match.params
      const score = scoreSelector(state, scoreId)
      return {
        score,
        staves: stavesSelector(state, scoreId),
      }
    }
  )
)(ScorePage)
