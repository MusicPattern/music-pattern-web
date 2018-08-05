import { Icon } from 'pass-culture-shared'
import React from 'react'
import { connect } from 'react-redux'

import { THUMBS_URL } from '../../utils/config'

const Avatar = ({
  translated,
  user,
  whiteHeader
}) => {
  if (user) {
    const backgroundStyle = {
      backgroundImage: `url('${THUMBS_URL}/users/${user.id}')`,
      backgroundSize: 'cover'
    }
    return (
      <div className="avatar" style={backgroundStyle} />
    )
  } else {
    return (
      <span className='icon'>
        <Icon svg={`ico-user-circled${whiteHeader ? '' : '-w'}`} />
      </span>
    )
  }
}

export default connect(
  (state, ownProps) => ({
    user: ownProps.user || state.user
  })
)(Avatar)
