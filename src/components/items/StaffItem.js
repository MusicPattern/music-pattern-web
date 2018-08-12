import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { compose } from 'redux'

const StaffItem = ({
  staff
}) => {
  const {
    bars
  } = (staff || {})
  console.log('bars', bars)
  return (
    <div className='box'>
    </div>
  )
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => ({})
  )
)(StaffItem)
