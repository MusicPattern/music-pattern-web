import React from 'react'
import { connect } from 'react-redux'

import melodySelector from '../../selectors/melody'
import rhythmSelector from '../../selectors/rhythm'

const VoiceItem = ({
  melody,
  rhythm,
  voice
}) => {
  const {
    name
  } = (voice || {})

  console.log('melody', melody, 'voice', voice)

  return (
    <div className='box'>
      {name}
    </div>
  )
}

export default connect(
  (state, ownProps) => {
    const { melodyId, rhythmId } = ownProps.voice
    return {
      melody: melodySelector(state, melodyId),
      rhythm: rhythmSelector(state, rhythmId)
    }
  }
)(VoiceItem)
