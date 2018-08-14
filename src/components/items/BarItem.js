import React from 'react'
import { connect } from 'react-redux'

import VoiceItem from './VoiceItem'
import voicesSelector from '../../selectors/voices'

const BarItem = ({
  bar,
  voices
}) => {
  const {
    name
  } = (bar || {})
  return (
    <div className='box'>
      {name}
      {voices.map(voice => <VoiceItem bar={bar} key={voice.id} voice={voice} />)}
    </div>
  )
}

export default connect(
  (state, ownProps) => ({
    voices: voicesSelector(state, ownProps.bar.id)
  })
)(BarItem)
