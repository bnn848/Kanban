import React from 'react'
import { GlobalStyle } from './GlobalStyle'
import ReactDOM from 'react-dom'
import { App } from './App'

ReactDOM.render(
  <>
    <GlobalStyle />
    <App />
  </>,
  document.getElementById('app'))
