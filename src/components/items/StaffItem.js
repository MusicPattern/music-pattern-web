import React from 'react'
import { connect } from 'react-redux'

import VoiceItem from './VoiceItem'
import voicesSelector from '../../selectors/voices'

const StaffItem = ({
  voices,
  staff
}) => {
  const {
    name
  } = staff
  return (
    <div className='box'>
      Staff: {name}
      {voices.map(voice => <VoiceItem
        key={voice.id}
        staff={staff}
        voice={voice} />)}
    </div>
  )
}

export default connect(
  (state, ownProps) => ({
    voices: voicesSelector(state, ownProps.staff.id)
  })
)(StaffItem)
