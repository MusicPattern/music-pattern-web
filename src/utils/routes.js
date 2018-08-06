import React from 'react'
import { Redirect } from 'react-router'

import HarmoniesPage from '../components/pages/HarmoniesPage'
import HomePage from '../components/pages/HomePage'
import SigninPage from '../components/pages/SigninPage'
import SignupPage from '../components/pages/SignupPage'

const routes = [
  {
    exact: true,
    path: '/',
    render: () => <Redirect to="/home" />,
  },
  {
    exact: true,
    path: '/harmonies',
    title: "Harmonies",
    render: () => <HarmoniesPage />,
  },
  {
    exact: true,
    path: '/home',
    title: "Home",
    render: () => <HomePage />,
  },
  {
    exact: true,
    path: '/signin',
    title: 'Signin',
    render: () => <SigninPage />,
  },
  {
    exact: true,
    path: '/signup',
    title: 'Signup',
    render: () => <SignupPage />,
  }
]

export default routes
