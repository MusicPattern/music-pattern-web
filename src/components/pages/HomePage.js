import {
  requestData, withLogin
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'

import Main from '../layout/Main'

class HomePage extends Component {

  render () {
    return (
      <Main
        fullscreen
        name='home'
      >
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
)(HomePage)
