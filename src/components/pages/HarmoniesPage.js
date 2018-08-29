import {
  requestData,
  withLogin
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import Main from '../layout/Main'
import { harmonyNormalizer } from '../../utils/normalizers'

class HarmoniesPage extends Component {
  handleDataRequest = (handleSuccess, handleFail) => {
    const { dispatch } = this.props
    dispatch(requestData(
      'GET',
      'harmonies', {
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
        name='harmonies'>
        <section className='section columns is-vcentered is-medium'>
          OUAI
        </section>
      </Main>
    )
  }
}

export default compose(
  withLogin({ failRedirect: "/signin" }),
  connect(state => ({}))
)(HarmoniesPage)
