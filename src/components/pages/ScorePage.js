import {
  requestData, withLogin
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Tone from 'tone'

import Main from '../layout/Main'
import InstrumentsManager from '../managers/InstrumentsManager'
import StavesManager from '../managers/StavesManager'
import { scoreNormalizer } from '../../utils/normalizers'
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
        normalizer: scoreNormalizer
      }))
  }

  handleTonePattern () {
    Tone.Sequencer.connect("score", action => {
      action === "setup" && this.forceUpdate()
    })
  }

  componentDidMount () {
    this.handleTonePattern()
  }

  render () {
    const {
      score
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
          <InstrumentsManager />
          <StavesManager />
        </section>
      </Main>
    )
  }
}

export default compose(
  withLogin({ failRedirect: "/signin" }),
  withRouter,
  connect(
    (state, ownProps) => {
      const { scoreId } = ownProps.match.params
      const score = scoreSelector(state, scoreId)
      return {
        score
      }
    }
  )
)(ScorePage)
