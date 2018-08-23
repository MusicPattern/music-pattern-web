import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Tone from 'tone'

import ScoreInstrumentItem from '../items/ScoreInstrumentItem'
import scoreInstrumentsSelector from '../../selectors/scoreInstruments'

class InstrumentsManager extends Component {

  onLoopClick = () => {
    Tone.Pattern.loop()
  }

  onStartStopClick = () => {
    Tone.Pattern.isPlaying
      ? Tone.Pattern.stop()
      : Tone.Pattern.start()
  }

  componentDidMount () {
    Tone.Pattern.connect("manager", () => this.forceUpdate())
  }

  render () {

    const {
      scoreInstruments
    } = this.props

    return (
      <div>
        {Tone.Pattern.isSetup && (
          <div>
            <button className='button is-primary' onClick={this.onStartStopClick}>
              {
                Tone.Pattern.isPlaying
                  ? 'STOP'
                  : 'START'
              }
            </button>
            <button className='button is-primary' onClick={this.onLoopClick}>
              {
                Tone.Transport.loop
                  ? 'LOOP OFF'
                  : 'LOOP ON'
              }
            </button>
          </div>
        )}
        {scoreInstruments.map(scoreInstrument =>
          <ScoreInstrumentItem
            key={scoreInstrument.id}
            scoreInstrument={scoreInstrument}
          />
        )}
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
        scoreInstruments: scoreInstrumentsSelector(state, scoreId),
      }
    }
  )
)(InstrumentsManager)
