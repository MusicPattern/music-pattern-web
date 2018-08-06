import {
  requestData
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

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

export default connect(
  state => ({}),
  { requestData }
)(HomePage)
