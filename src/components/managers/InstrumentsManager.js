import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { compose } from 'redux'

import InstrumentItem from '../items/InstrumentItem'
import { assignMusic } from '../../reducers/music'
import instrumentsSelector from '../../selectors/instruments'
import scoreSelector from '../../selectors/score'
import Player from '../../utils/player'

class InstrumentsManager extends Component {
  onStartClick = () => {
    this.props.player.start()
  }

  componentDidMount () {
    const { dispatch } = this.props
    const player = new Player({
      handleSetupSuccess: () => {
        dispatch(assignMusic({ isPlayerSetup: true }))
      }
    })
    dispatch(assignMusic({ player }))
  }

  render () {

    const {
      instruments,
      isPlayerSetup
    } = this.props

    return (
      <div>
        {isPlayerSetup && (
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
      const { isSetup } = (state.player || {})
      return {
        instruments: instrumentsSelector(state, scoreId),
        isPlayerSetup: isSetup,
        score
      }
    }
  )
)(InstrumentsManager)
