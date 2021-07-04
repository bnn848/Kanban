import { createGlobalStyle } from 'styled-components'

export const GlobalStyle = createGlobalStyle`
  html, body, #app {
    height: 100%;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen-Sans, Ubuntu, Cantarell, 'Helvetica Neue', sans-serif;
    overflow-wrap: break-word;
  }
`