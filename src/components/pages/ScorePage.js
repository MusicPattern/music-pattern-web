import {
  requestData
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import Main from '../layout/Main'
import InstrumentsManager from '../managers/InstrumentsManager'
import StavesManager from '../managers/StavesManager'
import { scoreNormalizer } from '../../utils/normalizers'
import scoreSelector from '../../selectors/score'

import Tone from 'tone'
/*
var synth = new Tone.Synth().toMaster()
const part = new Tone.Part(function(time, pitch){
  synth.triggerAttackRelease(pitch, "2n", time);
}, [["0", 1], ["1", 2], ["2", "G#3"], ["3", "C3"]]);
part.start(0);
*/

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
          <button onClick={()=>{
            Tone.Transport.stop()
            Tone.Transport.start()
          }}>
            Click
          </button>
          <InstrumentsManager />
          <StavesManager />
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
        score
      }
    }
  )
)(ScorePage)
