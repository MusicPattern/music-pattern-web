import classnames from 'classnames'
import get from 'lodash.get'
import { Icon } from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import Avatar from './Avatar'
import SignoutButton from './SignoutButton'
import Logo from './Logo'

class Header extends Component {
  constructor() {
    super()
    this.state = {
      showMobileMenu: false,
    }
  }

  render() {
    const {
      name,
      whiteHeader
    } = this.props
    const {
      showMobileMenu
    } = this.state
    return (
      <header className={classnames(
        'navbar',
        { 'is-primary': !whiteHeader }
      )}>
        <div className="container">
          <div className="navbar-brand">
            <Logo className="navbar-item" whiteHeader={whiteHeader} />
            <span className="navbar-burger" onClick={e => this.setState({
              showMobileMenu: !showMobileMenu
            })}>
              <span></span>
              <span></span>
              <span></span>
            </span>
          </div>
          <div className={classnames("navbar-menu", {
            'is-active': showMobileMenu
          })}>
            <div className="navbar-end">
              <div className="navbar-item has-dropdown is-hoverable">
                <NavLink className="navbar-link" to="#">
                  <Avatar />
                  <span>
                    {name}
                  </span>
                </NavLink>
                <div className="navbar-dropdown is-right">
                  <NavLink to={'/harmonies'} className='navbar-item'>
                    <span className='icon'><Icon svg='newspaper' /></span>
                    <span>Harmonies</span>
                  </NavLink>
                  <NavLink to={'/scores'} className='navbar-item'>
                    <span className='icon'><Icon svg='newspaper' /></span>
                    <span>Scores</span>
                  </NavLink>
                  <SignoutButton tagName='a' className='navbar-item'>
                    <span className='icon'><Icon svg='ico-deconnect' /></span>
                    <span>Déconnexion</span>
                  </SignoutButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    )
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      name: get(state, 'user.publicName')
    })
  )
)(Header)
