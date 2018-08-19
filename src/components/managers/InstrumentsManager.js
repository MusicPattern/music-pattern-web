import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'
import Tone from 'tone'

import InstrumentItem from '../items/InstrumentItem'
import instrumentsSelector from '../../selectors/instruments'
import scoreSelector from '../../selectors/score'

class InstrumentsManager extends Component {
  onStartClick = () => {
    Tone.Transport.start()
  }

  componentDidMount () {
    Tone.Player.connect("manager", () => this.forceUpdate())
  }

  render () {

    const {
      instruments
    } = this.props

    return (
      <div>
        {Tone.Player.isSetup && (
          <button className='button is-primary' onClick={this.onStartClick}>
            PLAY
          </button>
        )}
        {instruments.map(instrument =>
          <InstrumentItem
            instrument={instrument}
            key={instrument.id}
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
      const score = scoreSelector(state, scoreId)
      return {
        instruments: instrumentsSelector(state, scoreId),
        score
      }
    }
  )
)(InstrumentsManager)
