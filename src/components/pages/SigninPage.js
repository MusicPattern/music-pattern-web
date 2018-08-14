import {
  Field,
  Form,
  SubmitButton
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import Main from '../layout/Main'
import Logo from '../layout/Logo'

class SigninPage extends Component {

  componentDidUpdate () {
    const { history, user } = this.props
    if (user) {
      history.push('/reviews')
    }
  }

  render () {
    const { errors } = this.props
    return (
      <Main name="sign-in" fullscreen >
        <section className='hero has-text-grey'>
          <div className='hero-body'>
            <h1 className='title is-spaced is-1'>
              <Logo />
            </h1>
            <Form
              action='users/signin'
              layout='vertical'
              name='user'
              handleSuccessNotification={null}>
              <Field
                label='email'
                name='identifier'
                placeholder="email"
                type='email' />
              <Field
                autoComplete="current-password"
                label='password'
                name='password'
                placeholder='password'
                type='password' />
              <div className="errors">{errors}</div>
              <div className='field buttons-field'>
                <NavLink to="/signup" className="button is-secondary">
                  Sign up
                </NavLink>
                <SubmitButton className="button is-primary is-outlined">
                  Login
                </SubmitButton>
              </div>
            </Form>
          </div>
        </section>
      </Main>
    )
  }
}

export default compose(
  withRouter,
  connect(
    state => ({
      user: state.user,
    })
  )
)(SigninPage)
