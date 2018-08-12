import {
  requestData
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

import Main from '../layout/Main'
import { harmonyNormalizer } from '../../utils/normalizers'
import scoreSelector from '../../selectors/score'

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
        normalizer: harmonyNormalizer
      }))
  }

  render () {
    return (
      <Main
        fullscreen
        handleDataRequest={this.handleDataRequest}
        name='scores'>
        <section className='section columns is-vcentered is-medium'>
          OUAI
        </section>
      </Main>
    )
  }
}

export default compose(
  withRouter,
  connect(state => ({

  }))
)(ScorePage)
