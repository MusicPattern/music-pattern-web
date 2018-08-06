import {
  Field,
  Form,
  SubmitButton
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import Logo from '../layout/Logo'
import Main from '../layout/Main'

class SignupPage extends Component {

  componentDidUpdate () {
    const { history, user } = this.props
    if (user) {
      history.push('/reviews')
    }
  }

  render () {
    const {
      errors
    } = this.props
    return (
      <Main name="sign-up" fullscreen>
        <section className='hero'>
          <div className='hero-body'>
            <h1 className='title is-spaced is-1'>
              <Logo />
            </h1>
            <Form
              action='/users'
              handleSuccessNotification={'Votre compte a bien été enregistré'}
              name='user'
              layout='vertical'>
              <Field
                name='email'
                label='email'
                placeholder="nom@example.fr"
                required />
              <Field
                autoComplete='name'
                name='publicName'
                label='login'
                placeholder='login'
                required />
              <Field
                autoComplete="new-password"
                name='password'
                label='password'
                placeholder="password"
                required
                type="password" />
              <div className="errors">{errors}</div>
              <div className='field buttons-field'>
                <NavLink to="/signin" className="button is-secondary">
                  Already have an account
                </NavLink>
                <SubmitButton className="button is-primary is-outlined">
                  Sign up
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
)(SignupPage)
