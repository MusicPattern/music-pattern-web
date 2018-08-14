import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

const ScoreItem = ({
  score
}) => {
  const {
    id,
    name
  } = (score || {})
  return (
    <div className='box'>
      <NavLink to={`/scores/${id}`}>
        {name}
      </NavLink>
    </div>
  )
}

export default compose(
  withRouter,
  connect(
    (state, ownProps) => ({})
  )
)(ScoreItem)
