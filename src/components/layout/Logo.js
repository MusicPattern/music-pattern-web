import React from 'react'
import { NavLink } from 'react-router-dom'

import { ROOT_PATH } from '../../utils/config'

const Logo = ({ className }) => {
  return (
    <NavLink to='/' className={`logo ${className || ''}`}
      isActive={() => false}>
      <img src={`${ROOT_PATH}/icons/logo.png`} alt="Logo" />
    </NavLink>
  )
}

export default Logo
