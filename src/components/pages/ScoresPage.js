import {
  requestData
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'

import ScoreItem from '../items/ScoreItem'
import Main from '../layout/Main'
import { scoreNormalizer } from '../../utils/normalizers'

class ScoresPage extends Component {
  handleDataRequest = (handleSuccess, handleFail) => {
    const { dispatch } = this.props
    dispatch(requestData(
      'GET',
      'scores', {
        handleSuccess,
        handleFail,
        normalizer: scoreNormalizer
      }))
  }

  render () {
    const {
      scores
    } = this.props
    return (
      <Main
        fullscreen
        handleDataRequest={this.handleDataRequest}
        name='scores'>
        <section className='section'>
          SCORES
          {scores.map(score => <ScoreItem key={score.id} score={score} />)}
        </section>
      </Main>
    )
  }
}

export default connect(
  state => ({
    scores: state.data.scores
  })
)(ScoresPage)
