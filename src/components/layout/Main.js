import classnames from 'classnames'
import get from 'lodash.get'
import {
  closeNotification,
  Icon,
  Modal,
  requestData,
  resetForm,
  showNotification,
  Spinner,
  withLogin
} from 'pass-culture-shared'
import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { NavLink } from 'react-router-dom'
import { compose } from 'redux'

import Header from './Header'

class Main extends Component {

  constructor () {
    super()
    this.state = {
      loading: false,
    }
  }

  static defaultProps = {
    Tag: 'main',
  }

  handleDataFail = (state, action) => {
    this.setState({
      loading: false,
    })
    this.props.showNotification({
      type: 'danger',
      text: get(action, 'errors.global', []).join('\n') || 'Loading Error'
    })
  }

  handleDataRequest = () => {
    if (this.props.handleDataRequest) {
      // possibility of the handleDataRequest to return
      // false in orde to not trigger the loading
      this.setState({
        loading: true
      })
      this.props.handleDataRequest(
        this.handleDataSuccess,
        this.handleDataFail
      )
    }
  }

  handleDataSuccess = (state, action) => {
    this.setState({
      loading: false,
    })
  }

  handleHistoryBlock = () => {
    const {
      blockers,
      history
    } = this.props
    this.unblock && this.unblock()
    this.unblock = history.block(
      () => {

        // test all the blockers
        for (let blocker of blockers) {
          const {
            block
          } = (blocker || {})
          const shouldBlock = block && block(this.props)
          if (shouldBlock) {
            return false
          }
        }

        // return true by default, which means that we don't block
        // the change of pathname
        return true
      }
    )
  }

  componentDidMount () {
    this.handleHistoryBlock()
    this.props.user && this.handleDataRequest()
  }

  componentDidUpdate (prevProps) {
    const blockersChanged = prevProps.blockers !== this.props.blockers
    const userChanged = !prevProps.user && this.props.user // User just loaded
    const searchChanged = this.props.location.search !== prevProps.location.search

    if (blockersChanged) {
      //this.handleHistoryBlock()
    }
    if (userChanged || searchChanged) {
      this.handleDataRequest()
    }
  }

  componentWillUnmount() {
    this.unblock && this.unblock()
    this.props.resetForm()
  }

  render () {
    const {
      backTo,
      children,
      closeNotification,
      coloredBg,
      fullscreen,
      header,
      name,
      noHeader,
      notification,
      Tag,
      whiteHeader,
    } = this.props
    const {
      loading
    } = this.state
    const footer = [].concat(children).find(e => e && e.type === 'footer')
    const content = []
      .concat(children)
      .filter(e => e && e.type !== 'header' && e.type !== 'footer')

    return [
      !noHeader && <Header key='header' whiteHeader={whiteHeader} {...header} />,
      <Tag
        className={classnames({
          page: true,
          [`${name}-page`]: true,
          'with-header': Boolean(header),
          'colored-bg': coloredBg,
          'white-header': whiteHeader,
          container: !fullscreen,
          fullscreen,
          loading,
        })}
        key='main'
      >
        <Modal />
        { fullscreen ? content : (
          <div className='columns is-gapless'>
            <div className='page-content column is-10 is-offset-1'>
              {
                notification && (
                  <div className={`notification is-${notification.type || 'info'}`}>
                    {notification.text}
                    <button className="close" onClick={closeNotification}>
                      OK
                    </button>
                  </div>
                )
              }
              <div className='after-notification-content'>
                {backTo && (
                  <NavLink to={backTo.path} className='back-button has-text-primary'>
                    <Icon svg='ico-back' />{` ${backTo.label}`}
                  </NavLink>
                )}
                <div className='main-content'>
                  {content}
                </div>
                {loading && <Spinner />}
              </div>
            </div>
          </div>
        )}
        {footer}
      </Tag>
    ]
  }
}

export default compose(
  withRouter,
  withLogin({ failRedirect: '/signin' }),
  connect(
    state => ({
      blockers: state.blockers,
      notification: state.notification,
      user: state.user,
    }),
    {
      closeNotification,
      requestData,
      resetForm,
      showNotification,
    }
  )
)(Main)
