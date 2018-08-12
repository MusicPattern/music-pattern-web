import React from 'react'
import { Redirect } from 'react-router'

import HarmoniesPage from '../components/pages/HarmoniesPage'
import HomePage from '../components/pages/HomePage'
import ScorePage from '../components/pages/ScorePage'
import ScoresPage from '../components/pages/ScoresPage'
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
    path: '/scores',
    title: "Scores",
    render: () => <ScoresPage />,
  },
  {
    exact: true,
    path: '/scores/:scoreId',
    title: "Score",
    render: () => <ScorePage />,
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
