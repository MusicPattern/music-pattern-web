import React from 'react'
import { connect } from 'react-redux'

import BarItem from './BarItem'
import barsSelector from '../../selectors/bars'

const StaffItem = ({
  bars,
  staff
}) => {
  return (
    <div className='box'>
      {bars.map(bar => <BarItem key={bar.id} staff={staff} bar={bar} />)}
    </div>
  )
}

export default connect(
  (state, ownProps) => ({
    bars: barsSelector(state, ownProps.staff.id)
  })
)(StaffItem)
